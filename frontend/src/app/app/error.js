"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFE] px-4 -pb-10 dark:bg-[#070811]">
      <div className="w-full max-w-md rounded-3xl  p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#101321]">
        <h2 className="text-xl font-semibold">Something went wrong</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't load your page right now.
        </p>

        {error.message && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error.message}
          </p>
        )}

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
