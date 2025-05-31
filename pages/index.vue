<template>
  <div class="max-w-s w-full mx-auto">
    <h1 class="text-xl sm:text-2xl font-bold mb-6 text-center">Logga in</h1>

    <form
      @submit.prevent="handleLogin"
      class="space-y-4"
      aria-label="Inloggningsformulär"
    >
      <!-- Användarnamn -->
      <div>
        <label for="username" class="block mb-1 text-sm font-medium">
          Användarnamn
        </label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          placeholder="Ange ditt användarnamn"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <!-- Lösenord -->
      <div>
        <label for="password" class="block mb-1 text-sm font-medium">
          Lösenord
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="Ange ditt lösenord"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <!-- Logga in-knapp -->
      <button
        type="submit"
        :disabled="isLoading || !username || !password"
        class="block mx-auto w-full max-w-[150px] bg-sky-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ isLoading ? "Loggar in…" : "Logga in" }}
      </button>
    </form>

    <!-- Registreringslänk -->
    <p class="mt-6 text-sm text-center">
      Inget konto?
      <NuxtLink to="/register" class="text-blue-600 hover:underline">
        Registrera dig här
      </NuxtLink>
    </p>

    <!-- Felmeddelande -->
    <p v-if="error" class="text-red-600 mt-2 text-center text-sm" role="alert">
      {{ error }}
    </p>
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
if (import.meta.client && token.value) {
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
