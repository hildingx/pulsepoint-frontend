// composables/useHealthEntries.ts
import { useStorage } from "@vueuse/core";
import type { HealthEntry } from "~/types/healthEntry";

export function useHealthEntries() {
  const token = useStorage("token", "");
  // Hämta entries via useFetch
  const { data, pending, error, refresh } = useLazyFetch<HealthEntry[]>(
    "http://localhost:5036/api/healthentries",
    {
      headers: { Authorization: `Bearer ${token.value}` },
      server: false,
    }
  );

  return {
    entries: data,
    pending,
    error,
    refresh,
  };
}
