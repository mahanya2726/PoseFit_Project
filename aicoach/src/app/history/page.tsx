"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type PoseFitSession = {
  exercise: string;
  date: string;
  total: number;
  good: number;
  bad: number;
  accuracy: number;
};

export default function HistoryPage() {
  const [data, setData] = useState<PoseFitSession[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const history = JSON.parse(localStorage.getItem("posefit_history") || "[]");
    setData(history);
  }, []);

  if (!mounted || data.length === 0) return null;

  const grouped = data.reduce((acc: Record<string, PoseFitSession[]>, entry) => {
    if (!acc[entry.exercise]) acc[entry.exercise] = [];
    acc[entry.exercise].push(entry);
    return acc;
  }, {});

  const exercises = ["squat", "pushup", "lunges", "plank"];
  const labels: Record<string, string> = {
    squat: "🏋️ Squats",
    pushup: "💪 Pushups",
    lunges: "🦵 Lunges",
    plank: "🧘 Planks",
  };
  const colors: Record<string, string> = {
    squat: "#facc15",
    pushup: "#3b82f6",
    lunges: "#a855f7",
    plank: "#10b981",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-8">📜 Your Workout History</h1>

      {exercises.map((exercise) =>
        grouped[exercise] && grouped[exercise].length > 0 ? (
          <div
            key={exercise}
            className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl mb-10"
          >
            <h2 className="text-2xl font-semibold mb-4">{labels[exercise]}</h2>

            <div className="h-[300px]">
              <ResponsiveContainer>
                <LineChart data={grouped[exercise]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    stroke="#ccc"
                    tickFormatter={(d) => new Date(d).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="good"
                    stroke="#22c55e"
                    name="Good"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="bad"
                    stroke="#ef4444"
                    name="Bad"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke={colors[exercise]}
                    name="Accuracy (%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
