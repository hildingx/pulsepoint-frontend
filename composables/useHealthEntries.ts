import { useStorage } from "@vueuse/core";
import type { HealthEntry } from "~/types/healthEntry";

export async function useHealthEntries() {
  const token = useStorage("token", "");
  const entries = useState<HealthEntry[] | null>("entries", () => null);

  const { pending, refresh, error } = useLazyFetch<HealthEntry[]>(
    "http://localhost:5036/api/healthentries",
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      server: false,
      onResponse({ response }) {
        entries.value = response._data;
      },
    }
  );

  // När token ändras → hämta nya entries
  watch(token, (newToken) => {
    if (newToken) {
      refresh();
    } else {
      entries.value = null; // Nollställ vid utloggning
    }
  });

  return {
    entries,
    pending,
    refresh,
    error,
  };
}
