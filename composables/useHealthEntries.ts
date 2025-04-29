import { useStorage } from "@vueuse/core";
import type { HealthEntry } from "~/types/healthEntry";

export async function useHealthEntries() {
  const token = useStorage("token", "");

  const { data, pending, error } = await useLazyFetch<HealthEntry[]>(
    "http://localhost:5036/api/healthentries",
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      server: false,
    }
  );

  return {
    entries: data,
    pending,
    error,
  };
}
