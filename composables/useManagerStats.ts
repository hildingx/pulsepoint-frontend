// composables/useManagerStats.ts
interface DailyStat {
  date: string;
  averageMood: number;
  averageSleep: number;
  averageStress: number;
  averageActivity: number;
  averageNutrition: number;
}

export async function useManagerStats(token: Ref<string>) {
  const { data, pending, error, refresh } = await useLazyFetch<DailyStat[]>(
    "http://localhost:5036/api/healthentries/stats/daily",
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      server: false,
    }
  );

  return {
    stats: data,
    pending,
    error,
    refresh,
  };
}
