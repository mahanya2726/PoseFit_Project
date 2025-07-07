"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ExerciseResultPage() {
  const params = useSearchParams();

  const exercise = params.get("exercise") || "exercise";
  const total = params.get("total") || "0";
  const good = params.get("good") || "0";
  const bad = params.get("bad") || "0";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-white capitalize">
        🏁 {exercise} Session Results
      </h1>

      <div className="bg-black/40 backdrop-blur-md p-6 rounded-lg shadow-md text-center space-y-4 w-full max-w-sm border border-white/20">
        <div className="text-xl text-white">🏋️ Total Reps: <b>{total}</b></div>
        <div className="text-green-400 text-xl">✅ Good Form: <b>{good}</b></div>
        <div className="text-red-400 text-xl">❌ Bad Form: <b>{bad}</b></div>
      </div>

      <Link href={`/session/start?exercise=${exercise}`} className="mt-6 text-blue-400 font-semibold underline">
        🔁 Try Again
      </Link>

      <Link href="/select" className="mt-3 text-gray-300 text-sm underline">
        🔙 Back to Select Page
      </Link>
    </div>
  );
}
