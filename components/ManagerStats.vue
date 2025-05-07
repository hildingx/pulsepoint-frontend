<template>
  <div>
    <h3>Statistik för din arbetsplats</h3>

    <p v-if="pending">Laddar statistik...</p>
    <p v-else-if="error" style="color: red">Kunde inte hämta statistik.</p>
    <div v-else>
      <select v-model="selectedRange">
        <option value="7">Senaste veckan</option>
        <option value="30">Senaste månaden</option>
        <option value="365">Senaste året</option>
      </select>

      <HealthGraph
        v-for="key in keys"
        :key="key"
        :entries="graphStats"
        :valueKey="key"
        :title="titles[key]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { useManagerStats } from "@/composables/useManagerStats";
import HealthGraph from "@/components/HealthGraph.vue";
import type { HealthEntry } from "@/types/healthEntry";

type GraphStatEntry = HealthEntry & { entryCount: number };

// Token krävs för fetch
const token = useStorage("token", "");
const selectedRange = ref(30);

const { stats, pending, error } = await useManagerStats(token);

// Ange HealthEntry-kompatibla nycklar
const keys = ["mood", "sleep", "stress", "activity", "nutrition"] as const;
type Key = (typeof keys)[number];
const titles: Record<Key, string> = {
  mood: "Humör (snitt)",
  sleep: "Sömn (snitt)",
  stress: "Stress (snitt)",
  activity: "Aktivitet (snitt)",
  nutrition: "Kost (snitt)",
};

// Mappa och filtrera stats → HealthEntry[]
const graphStats = computed<GraphStatEntry[]>(() => {
  if (!stats.value) return [];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - selectedRange.value);

  return stats.value
    .filter((s) => new Date(s.date) >= cutoff)
    .map((s, i) => ({
      id: i,
      mood: s.averageMood,
      sleep: s.averageSleep,
      stress: s.averageStress,
      activity: s.averageActivity,
      nutrition: s.averageNutrition,
      date: s.date,
      entryCount: s.entryCount,
    }));
});
</script>
