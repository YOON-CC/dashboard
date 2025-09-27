"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold text-red-500">Something went wrong!</h1>
      <p className="text-white/80">{error.message}</p>
      <button
        className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
