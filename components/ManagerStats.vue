<template>
  <div class="space-y-6">
    <h3 class="text-2xl font-semibold text-gray-800">
      Statistik för din arbetsplats
      <span v-if="workplaceName">({{ workplaceName }})</span>
    </h3>

    <p v-if="pending" class="text-gray-600">Laddar statistik...</p>
    <p v-else-if="error" class="text-red-600 font-medium">
      Kunde inte hämta statistik.
    </p>

    <div v-else class="space-y-4">
      <div>
        <label for="range" class="block mb-1 text-sm font-medium text-gray-700"
          >Välj tidsintervall:</label
        >
        <select
          id="range"
          v-model="selectedRange"
          class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
        >
          <option value="7">Senaste veckan</option>
          <option value="30">Senaste månaden</option>
          <option value="365">Senaste året</option>
        </select>
      </div>

      <div class="space-y-8">
        <HealthGraph
          v-for="key in keys"
          :key="key"
          :entries="graphStats"
          :valueKey="key"
          :title="titles[key]"
        />
      </div>
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
const { workplaceName } = await useWorkplaceName();

// Nycklar som visas i separata grafer
const keys = ["mood", "sleep", "stress", "activity", "nutrition"] as const;
type Key = (typeof keys)[number];

// Titel för varje värde, visas i grafen
const titles: Record<Key, string> = {
  mood: "Humör (snitt)",
  sleep: "Sömn (snitt)",
  stress: "Stress (snitt)",
  activity: "Aktivitet (snitt)",
  nutrition: "Kost (snitt)",
};

// Filtrera stats på valt intervall och mappa om till format som HealthGraph förstår
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

interface Workplace {
  id: number;
  name: string;
}
</script>
