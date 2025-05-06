<template>
  <div>
    <h1>Logga in</h1>

    <form @submit.prevent="handleLogin" aria-label="Inloggningsformulär">
      <div>
        <label for="username">Användarnamn</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          placeholder="Skriv ditt användarnamn"
          aria-required="true"
          aria-label="Användarnamn"
        />
      </div>

      <div>
        <label for="password">Lösenord</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="Skriv ditt lösenord"
          aria-required="true"
          aria-label="Lösenord"
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading || !username || !password"
        :aria-disabled="isLoading ? 'true' : 'false'"
      >
        {{ isLoading ? "Loggar in…" : "Logga in" }}
      </button>
    </form>

    <p>Inget konto? Registrera dig <NuxtLink to="/register">här</NuxtLink></p>

    <p v-if="error" style="color: red" role="alert">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { useUser } from "@/composables/useUser";

definePageMeta({
  layout: "auth",
});

// Om användaren redan har en token, navigera direkt till dashboard
const { token } = useUser();
if (token.value) {
  navigateTo("/dashboard");
}

// Formulärfält
const username = ref<string>("");
const password = ref<string>("");

// Hantera inloggning
const { login, error } = useAuth();
const isLoading = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) return;

  isLoading.value = true;
  try {
    await login(username.value, password.value);
    // Redirect sker i useAuth eller efter lyckad login
  } finally {
    isLoading.value = false;
  }
};
</script>
