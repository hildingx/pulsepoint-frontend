<template>
  <div>
    <h2>Välkommen till din dashboard</h2>

    <!-- Laddar -->
    <p v-if="pending">Laddar användardata...</p>

    <!-- Fel -->
    <p v-else-if="error">Något gick fel: {{ error.message }}</p>

    <!-- Visa användarnamn -->
    <p v-else-if="user">
      Inloggad som: {{ user.userName }}
      <br />
      Ditt namn är: {{ user.firstName }}
      {{ user.lastName }}
      <br />
      Din roll är: {{ user.roles.join(", ") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useUser } from "~~/composables/useUser"; // Importera auth composable

definePageMeta({
  layout: "default",
});

const { user, pending, error } = useUser(); // Använd auth composable för att hämta användardata
</script>
