// composables/useHealthEntries.ts
import { useStorage } from "@vueuse/core";
import { useUser } from "@/composables/useUser";
import type { HealthEntry } from "~/types/healthEntry";

export function useHealthEntries() {
  const token = useStorage("token", "");
  const { user } = useUser();

  // Använd userId som key för att få unikt cache-tillstånd per användare
  const { data, pending, error, refresh } = useFetch<HealthEntry[]>(
    () => `http://localhost:5036/api/healthentries`,
    {
      headers: { Authorization: `Bearer ${token.value}` },
      key: () => `healthentries-${user.value?.id ?? "anon"}`, // dynamisk key
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
