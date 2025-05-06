<template>
  <div>
    <h2>Dina hälsografer</h2>

    <!-- Välj tidsintervall -->
    <label for="dateRange">Välj tidsintervall:</label>
    <select
      v-model="selectedRange"
      id="dateRange"
      name="dateRange"
      aria-label="Välj tidsintervall"
    >
      <option value="7">Senaste veckan</option>
      <option value="30">Senaste månaden</option>
      <option value="365">Senaste året</option>
    </select>

    <!-- Felmeddelande vid misslyckad hämtning -->
    <p v-if="error" style="color: red" role="alert">
      Kunde inte hämta dina hälsoregistreringar.
    </p>

    <!-- Laddningsmeddelande -->
    <p v-else-if="pending">Laddar hälsodata...</p>

    <!-- Ingen data -->
    <p v-else-if="sortedFilteredEntries.length === 0">
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
const { token } = useUser();

definePageMeta({ layout: "default" });

// Skicka användare till startsidan om ingen token
if (!token.value) {
  navigateTo("/");
}

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
