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
        :entries="filteredStats"
        :valueKey="key"
        :title="titles[key]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";
import { useManagerStats } from "@/composables/useManagerStats";
import HealthGraph from "@/components/HealthGraph.vue";

// Token krävs för fetch
const token = useStorage("token", "");
const selectedRange = ref(30);

const { stats, pending, error } = await useManagerStats(token);

// Nycklar och titlar för grafer
const keys = [
  "averageMood",
  "averageSleep",
  "averageStress",
  "averageActivity",
  "averageNutrition",
] as const;
const titles = {
  averageMood: "Humör (snitt)",
  averageSleep: "Sömn (snitt)",
  averageStress: "Stress (snitt)",
  averageActivity: "Aktivitet (snitt)",
  averageNutrition: "Kost (snitt)",
};

// Filtrera senaste X dagar
const filteredStats = computed(() => {
  if (!stats.value) return [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - selectedRange.value);
  return stats.value.filter((s) => new Date(s.date) >= cutoff);
});
</script>
