"use client";

import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect } from "react";

export default function ResultPage() {
  const params = useSearchParams();

  const exercise = params.get("exercise") || "unknown";
  const isPlank = exercise === "plank";

  const total = isPlank
    ? parseFloat(params.get("duration") || "0")
    : parseInt(params.get("total") || "0");

  const good = isPlank
    ? total - parseInt(params.get("badframes") || "0")
    : parseInt(params.get("good") || "0");

  const bad = isPlank
    ? parseInt(params.get("badframes") || "0")
    : parseInt(params.get("bad") || "0");

  const accuracy = total > 0 ? ((good / total) * 100).toFixed(1) : "0.0";
  const calories = (total * (isPlank ? 0.15 : 0.4)).toFixed(1);
  const duration = isPlank ? total : total * 2;

  const warnings = decodeURIComponent(params.get("warnings") || "")
    .split("; ")
    .filter((w) => w.trim().length > 0);

  const chartData = [
    { name: "Good", value: good, fill: "#22c55e" },
    { name: "Bad", value: bad, fill: "#ef4444" },
  ];

  // Save result in localStorage for history
  useEffect(() => {
    const today = new Date().toISOString();

    const newEntry = {
      exercise,
      date: today,
      total,
      good,
      bad,
      accuracy: parseFloat(accuracy),
    };

    const prev = JSON.parse(localStorage.getItem("posefit_history") || "[]");
    localStorage.setItem("posefit_history", JSON.stringify([...prev, newEntry]));
    console.log("✅ Saved to posefit_history:", newEntry);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-black to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">🏁 {exercise.toUpperCase()} Results</h1>

      <div className="w-full max-w-xl space-y-6 bg-white/10 rounded-xl p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-sm text-gray-400">
              Total {isPlank ? "Seconds" : "Reps"}
            </p>
            <p className="text-xl font-semibold">{total}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-sm text-gray-400">Accuracy</p>
            <p className="text-xl font-semibold">{accuracy}%</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-sm text-gray-400">Calories Burned</p>
            <p className="text-xl font-semibold">{calories}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-sm text-gray-400">Workout Duration</p>
            <p className="text-xl font-semibold">{duration} sec</p>
          </div>
        </div>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Posture Feedback */}
        <div className="bg-black/30 rounded-lg p-4 text-sm text-gray-300">
          <p className="text-base font-semibold mb-2">
            {isPlank ? "🧠 Posture Feedback:" : "🧠 Form Insights:"}
          </p>

          {total === 0 ? (
            <p className="text-red-400">
              ❌ No proper {exercise} detected. Please ensure your form is visible and try again.
            </p>
          ) : warnings.length === 0 ? (
            <p className="text-green-400">
              ✅ Great job! No major posture issues detected during your {exercise} session.
            </p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((w, idx) => (
                <li key={idx} className="text-red-300">{w}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 justify-center">
          <button
            onClick={() => window.location.href = `/session/${exercise}`}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md text-white font-medium"
          >
            🔁 Try Again
          </button>
          <button
            onClick={() => window.location.href = "/select"}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md text-white font-medium"
          >
            🔙 Go to Select Page
          </button>
        </div>
      </div>
    </div>
  );
}
