// composables/useWorkplaceName.ts
import { useUser } from "@/composables/useUser";

interface Workplace {
  id: number;
  name: string;
}

export async function useWorkplaceName() {
  const { user } = useUser();

  const { data } = await useFetch<Workplace[]>(
    "http://localhost:5036/api/workplaces",
    { server: false }
  );

  const workplaceName = computed(() => {
    const all = data.value ?? [];
    return all.find((w) => w.id === user.value?.workplaceId)?.name ?? "";
  });

  return { workplaceName };
}
