<template>
  <div>
    <h2>Dina hälsografer</h2>

    <label for="dateRange">Välj tidsintervall:</label>
    <select v-model="selectedRange" id="dateRange" name="dateRange">
      <option value="7">Senaste veckan</option>
      <option value="30">Senaste månaden</option>
      <option value="365">Senaste året</option>
    </select>

    <HealthGraph
      :entries="sortedFilteredEntries ?? []"
      valueKey="mood"
      title="Humör över tid"
    />
    <HealthGraph
      :entries="sortedFilteredEntries ?? []"
      valueKey="sleep"
      title="Sömn över tid"
    />
    <HealthGraph
      :entries="sortedFilteredEntries ?? []"
      valueKey="stress"
      title="Stress över tid"
    />
    <HealthGraph
      :entries="sortedFilteredEntries ?? []"
      valueKey="activity"
      title="Fysisk aktivitet över tid"
    />
    <HealthGraph
      :entries="sortedFilteredEntries ?? []"
      valueKey="nutrition"
      title="Kost över tid"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import HealthGraph from "@/components/HealthGraph.vue";
import { useHealthEntries } from "@/composables/useHealthEntries";

definePageMeta({
  layout: "default",
});

const { entries, pending, error } = await useHealthEntries();
const selectedRange = ref(30); // Standard: senaste månaden

const sortedFilteredEntries = computed(() => {
  const allEntries = entries.value ?? [];

  // Filtrera på valt intervall (t.ex. 7 dagar)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - selectedRange.value);

  const filtered = allEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoff;
  });

  // Sortera på datum (äldst först)
  return filtered.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
});
</script>
