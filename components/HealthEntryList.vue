<template>
  <div>
    <div v-if="pending">Laddar hälsodata...</div>

    <div v-else-if="error">Kunde inte hämta hälsodata.</div>

    <ul v-else>
      <li v-for="entry in entries" :key="entry.id">
        Datum: {{ entry.date }} - Humör: {{ entry.mood }}/5, Sömn:
        {{ entry.sleep }}/5
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { HealthEntry } from "@/types/healthEntry";

defineProps<{
  entries: HealthEntry[] | null;
  pending: boolean;
  error: any;
}>();
</script>
