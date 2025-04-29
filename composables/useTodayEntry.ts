import { computed } from "vue";
import type { HealthEntry } from "@/types/healthEntry";

// Composable som tar in en lista av hälsoregistreringar och returnerar den senaste registreringen samt en flagga som indikerar om det har skickats in en registrering idag.
export function useTodayEntry(entries: Ref<HealthEntry[] | null>) {
  // Hitta den senaste registreringen baserat på datum
  const latestEntry = computed(() => {
    if (!entries.value || entries.value.length === 0) {
      return null;
    }
    // Sortera entries i fallande ordning (nyaste först) och ta första
    return [...entries.value].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  });

  // Kontrollera om senaste registreringen är från dagens datum
  const hasSubmittedToday = computed(() => {
    if (!latestEntry.value) {
      return false;
    }

    const today = new Date();
    const entryDate = new Date(latestEntry.value.date);

    return (
      today.getFullYear() === entryDate.getFullYear() &&
      today.getMonth() === entryDate.getMonth() &&
      today.getDate() === entryDate.getDate()
    );
  });

  // Returnera både senaste registreringen och om man fyllt i idag
  return {
    latestEntry,
    hasSubmittedToday,
  };
}
