// This composable checks if the user has submitted their health entry for today.
// It uses the Luxon library to handle date and time comparisons.
// composables/useTodayEntry.ts
import { DateTime } from "luxon";
import type { HealthEntry } from "@/types/healthEntry";
import type { UserData } from "@/types/auth";

export function useTodayEntry(
  entries: Ref<HealthEntry[] | null>,
  user: Ref<UserData | null>
) {
  const hasSubmittedToday = computed(() => {
    if (!user.value || !Array.isArray(entries.value)) return false;

    const today = DateTime.now();

    return entries.value.some((entry) => {
      const date = DateTime.fromISO(entry.date);
      return date.hasSame(today, "day");
    });
  });

  return { hasSubmittedToday };
}
