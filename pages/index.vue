<!-- Inloggningssida -->
<template>
  <div>
    <h2>Logga in</h2>

    <!-- Inloggningsformulär -->
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Användarnamn</label>
        <input id="username" v-model="username" type="text" required />
      </div>

      <div>
        <label for="password">Lösenord</label>
        <input id="password" v-model="password" type="password" required />
      </div>

      <button type="submit">Logga in</button>
    </form>
    <p>Inget konto? Registrera dig <NuxtLink to="/register">här</NuxtLink></p>

    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~~/composables/useAuth"; // Importera auth composable

definePageMeta({
  layout: "auth",
});

const username = ref("");
const password = ref("");

// använd login och error från useAuth composable
const { login, error } = useAuth();

const handleLogin = () => {
  // Anropa login-funktionen från useAuth composable
  login(username.value, password.value);
};
</script>
