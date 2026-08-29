"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const health = useQuery(api.health.ping);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-4 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Convex connected
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Health:{" "}
          {health === undefined
            ? "loading…"
            : health.ok
              ? "ok"
              : "unreachable"}
        </p>
      </main>
    </div>
  );
}
