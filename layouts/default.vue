<template>
  <div>
    <nav>
      <div>
        <h1>PulsePoint</h1>
        <button @click="logout">Logga ut</button>
      </div>
    </nav>

    <!-- Rendera inloggat läge -->
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth"; // Importera auth composable

const { logout } = useAuth(); // Använd auth composable för att hantera logout
</script>

<style scoped></style>
