"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SquatPage() {
  const router = useRouter();

  const handleReady = () => {
    router.push("/session/start"); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-3">
      <h1 className="text-4xl font-bold mb-6 text-center">Squat Reference</h1>
      <p className="text-gray-500 mb-4 text-center max-w-lg">
        Here's how your squat should look — maintain a straight back, knees not crossing toes,
        and a ~90° angle at the knee.
      </p>

        <div className="w-full max-w-md relative mb-6">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-black to-black/10 blur-lg z-0" />
            <img
                src="/correct_squat.jpg"
                alt="Squat Form"
                className="relative z-10 rounded-xl"
            />
        </div>


      <button
        onClick={handleReady}
        className="bg-primary text-white py-3 px-6 rounded-md font-semibold"
      >
        I'm Ready
      </button>
    </div>
  );
}
