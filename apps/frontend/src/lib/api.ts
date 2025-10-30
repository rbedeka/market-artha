import { Effect } from "effect";
import { HttpError } from "./errors";

// utils/api.ts
export async function fetchWithCookies<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // include HttpOnly cookies
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}

export const _fetchWithCookies = Effect.fn("fetchWithCookies")(function* (
  url: string,
  options?: RequestInit
) {
  const res = yield* Effect.tryPromise({
    try: () =>
      fetch(url, {
        ...options,
        credentials: "include", // include HttpOnly cookies
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
      }),
    catch: (err) => new HttpError({ message: "Failed to fetch" + err }),
  });

  if (!res.ok) {
    const error = yield* Effect.tryPromise({
      try: () => res.json(),
      catch: () => ({ message: res.statusText }),
    });
    throw new Error(error.message || "API request failed");
  }

  return yield* Effect.tryPromise({
    try: () => res.json(),
    catch: () => ({ message: "Failed to parse response" }),
  });
});
