<template>
  <div>
    <h2>Välkommen till din dashboard</h2>

    <!-- Laddar -->
    <p v-if="userPending">Laddar användardata...</p>

    <!-- Fel -->
    <p v-else-if="userError">Något gick fel: {{ error.message }}</p>

    <!-- Visa användarnamn -->
    <p v-else-if="user">
      Inloggad som: {{ user.userName }}
      <br />
      Ditt namn är: {{ user.firstName }}
      {{ user.lastName }}
      <br />
      Din roll är: {{ user.roles.join(", ") }}
    </p>

    <HealthEntryList
      :entries="entries"
      :pending="entriesPending"
      :error="entriesError"
    />
  </div>
</template>

<script setup lang="ts">
import { useUser } from "~~/composables/useUser"; // Importera auth composable
import HealthEntryList from "@/components/HealthEntryList.vue"; // Importera komponenten

definePageMeta({
  layout: "default",
});

const { user, pending: userPending, error: userError } = await useUser(); // Använd auth composable för att hämta användardata
const {
  entries,
  pending: entriesPending,
  error: entriesError,
} = await useHealthEntries();
</script>
