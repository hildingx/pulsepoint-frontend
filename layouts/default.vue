<template>
  <div>
    <nav>
      <div>
        <h1>PulsePoint</h1>

        <!-- Visa användarnamn -->
        <p v-if="user">
          Inloggad som: {{ user.userName }}
          <br />
          Ditt namn är: {{ user.firstName }}
          {{ user.lastName }}
          <br />
          Din roll är: {{ user.roles.join(", ") }}
        </p>

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
import { useUser } from "~~/composables/useUser";

const { user, pending: userPending, error: userError } = await useUser();
const { logout } = useAuth(); // Använd auth composable för att hantera logout
</script>

<style scoped></style>
