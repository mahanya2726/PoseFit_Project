"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function StartExercisePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [timer, setTimer] = useState<number | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songMap: Record<string, string> = {
    better: "/better-day-workout-beat.mp3",
    bouncy: "/bouncy-workout.mp3",
    order: "/order.mp3",
    workout1: "/sport-gym-workout -music-1.mp3",
    workout2: "/sport-gym-workout-music-2.mp3",
    metal: "/workout -metal.mp3",
    workout: "/workout.mp3",
  };

  const params = useSearchParams();
  const durationFromQuery = Number(params.get("duration")) || 10;
  const SESSION_DURATION = durationFromQuery;

  // Fetch selected exercise from localStorage
  const exercise = typeof window !== "undefined" ? localStorage.getItem("exercise") || "squat" : "squat";

  useEffect(() => {
    async function initCamera() {
      try {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(camStream);
        if (videoRef.current) {
          videoRef.current.srcObject = camStream;
        }
      } catch (err) {
        alert("Camera access is required to start the session.");
      }
    }
    initCamera();
  }, []);

  useEffect(() => {
    if (stream && countdown !== null) {
      if (countdown === 0) {
        setCountdown(null);
        startSession();
      } else {
        const timeout = setTimeout(() => setCountdown((prev) => (prev !== null ? prev - 1 : null)), 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [countdown, stream]);

  const startSession = () => {
    setSessionStarted(true);
    const chunks: Blob[] = [];

    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        setRecordedChunks(chunks);
        sendToBackend(blob);

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
      };

      mediaRecorder.start();

      const selectedSong = localStorage.getItem("selectedSong") || "none";
      if (selectedSong !== "none" && songMap[selectedSong]) {
        const audio = new Audio(songMap[selectedSong]);
        audio.volume = 0.4;
        audioRef.current = audio;
        audio.play().catch((err) => {
          console.warn("Song failed to play:", err);
        });
      }

      let remaining = SESSION_DURATION;
      setTimer(remaining);
      const interval = setInterval(() => {
        remaining--;
        setTimer(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          mediaRecorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        }
      }, 1000);
    }
  };

  const sendToBackend = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("video", blob, `${exercise}_video.webm`);

    try {
      const response = await fetch(`http://localhost:5000/upload-${exercise}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Server response:", result);

      window.location.href = `/session/result?total=${result.total_squats}&good=${result.good_squats}&bad=${result.bad_squats}`;
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to send video to backend.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2">
      <h1 className="text-2xl font-bold mb-4">🏋️ Start Your {exercise.charAt(0).toUpperCase() + exercise.slice(1)} Session</h1>

      {!sessionStarted && countdown !== null && (
        <div className="text-4xl font-bold text-blue-600">Your time starts in {countdown}...</div>
      )}

      {sessionStarted && timer !== null && (
        <div className="text-5xl font-bold text-red-600 mb-4">{timer}</div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded shadow-md w-[90vw] h-[100vh] object-cover"

      />
    </div>
  );
}
