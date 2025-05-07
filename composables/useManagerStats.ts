// composables/useManagerStats.ts
import type { DailyStat } from "~/types/dailyStat";

/**
 * Hämtar aggregerad hälsostatistik för manager-användare
 */
export function useManagerStats(token: Ref<string>) {
  const {
    data: stats,
    pending,
    error,
    refresh,
  } = useLazyFetch<DailyStat[]>(
    "http://localhost:5036/api/healthentries/stats/daily",
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      server: false,
    }
  );

  return {
    stats,
    pending,
    error,
    refresh,
  };
}
