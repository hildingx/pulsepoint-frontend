<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <h2 class="text-2xl font-bold text-gray-800 text-center">
      Utveckling över tid
    </h2>

    <!-- Välj tidsintervall -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <label for="dateRange" class="font-medium text-gray-700"
        >Välj tidsintervall:</label
      >
      <select
        v-model="selectedRange"
        id="dateRange"
        name="dateRange"
        aria-label="Välj tidsintervall"
        class="border border-gray-300 rounded px-3 py-2 text-sm"
      >
        <option value="7">Senaste veckan</option>
        <option value="30">Senaste månaden</option>
        <option value="365">Senaste året</option>
      </select>
    </div>

    <!-- Felmeddelande -->
    <p v-if="error" class="text-red-600 font-medium" role="alert">
      Kunde inte hämta dina hälsoregistreringar.
    </p>

    <!-- Laddning -->
    <p v-else-if="pending" class="text-gray-600">Laddar hälsodata...</p>

    <!-- Ingen data -->
    <p v-else-if="sortedFilteredEntries.length === 0" class="text-gray-600">
      Inga hälsoregistreringar hittades för valt tidsintervall.
    </p>

    <!-- Grafer -->
    <template v-else>
      <HealthGraph
        :entries="sortedFilteredEntries"
        valueKey="mood"
        title="Humör över tid"
      />
      <HealthGraph
        :entries="sortedFilteredEntries"
        valueKey="sleep"
        title="Sömn över tid"
      />
      <HealthGraph
        :entries="sortedFilteredEntries"
        valueKey="stress"
        title="Stress över tid"
      />
      <HealthGraph
        :entries="sortedFilteredEntries"
        valueKey="activity"
        title="Fysisk aktivitet över tid"
      />
      <HealthGraph
        :entries="sortedFilteredEntries"
        valueKey="nutrition"
        title="Kost över tid"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import HealthGraph from "@/components/HealthGraph.vue";
import { useHealthEntries } from "@/composables/useHealthEntries";
import type { HealthEntry } from "@/types/healthEntry";

definePageMeta({ layout: "default", middleware: "auth" });

// Hämta hälsodata via composable
const { entries, pending, error } = useHealthEntries();

// Vald tidsintervall i dagar (default: 30)
const selectedRange = ref<number>(30);

// Filtrera och sortera entries utifrån vald period
const sortedFilteredEntries = computed<HealthEntry[]>(() => {
  const allEntries = entries.value ?? [];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - selectedRange.value);

  const filtered = allEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoff;
  });

  return filtered.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
});
</script>
