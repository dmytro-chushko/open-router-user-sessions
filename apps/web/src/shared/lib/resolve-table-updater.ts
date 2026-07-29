import type { Updater } from "@tanstack/react-table";

/** Resolves a TanStack Table updater (value or reducer) against the current state. */
export function resolveTableUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === "function"
    ? (updater as (value: T) => T)(current)
    : updater;
}
