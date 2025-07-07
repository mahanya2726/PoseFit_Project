"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SelectPage() {
  const [exercise, setExercise] = useState("squat");
  const [duration, setDuration] = useState(10);
  const [song, setSong] = useState("none");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const handlePreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (song === "none") return;

    const songMap: Record<string, string> = {
      better: "/better-day-workout-beat.mp3",
      bouncy: "/bouncy-workout.mp3",
      order: "/order.mp3",
      workout1: "/sport-gym-workout -music-1.mp3",
      workout2: "/sport-gym-workout-music-2.mp3",
      metal: "/workout -metal.mp3",
      workout: "/workout.mp3",
    };

    const src = songMap[song];
    if (src) {
      const audio = new Audio(src);
      audio.volume = 0.5;
      audioRef.current = audio;
      audio.play().catch((err) => {
        console.warn("Audio playback failed:", err);
      });
    }
  };

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    localStorage.setItem("selectedSong", song);
    localStorage.setItem("duration", String(duration));
    localStorage.setItem("exercise", exercise);

    router.push(`/session/${exercise}`); // dynamically route based on exercise
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Select Your Workout</h1>

      <div className="w-full max-w-md space-y-5">
        {/* Exercise Selection */}
        <div>
          <label className="block mb-1 font-medium">Exercise:</label>
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-600 rounded-md"
          >
            <option value="squat">Squat</option>
            <option value="plank">Plank</option>
            <option value="pushup">Pushup</option>
            <option value="lunges">Lunge</option>
          </select>
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block mb-1 font-medium">Duration (seconds):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={5}
            max={120}
            className="w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-600 rounded-md"
          />
        </div>

        {/* Song Selection */}
        <div>
          <label className="block mb-1 font-medium">Workout Song:</label>
          <div className="flex gap-2 items-center">
            <select
              value={song}
              onChange={(e) => setSong(e.target.value)}
              className="w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-600 rounded-md"
            >
              <option value="none">No Song</option>
              <option value="better">Better Day Workout</option>
              <option value="bouncy">Bouncy Workout</option>
              <option value="order">Order</option>
              <option value="workout1">Sport Gym Workout 1</option>
              <option value="workout2">Sport Gym Workout 2</option>
              <option value="metal">Workout Metal</option>
              <option value="workout">Workout</option>
            </select>

            <button
              type="button"
              onClick={handlePreview}
              className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition"
              disabled={song === "none"}
            >
              🔊 Preview
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-primary text-white py-3 px-6 rounded-md font-semibold"
        >
          Start Workout
        </button>
      </div>
    </div>
  );
}
