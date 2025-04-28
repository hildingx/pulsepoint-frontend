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

    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";

const username = ref("");
const password = ref("");
const error = ref("");

const token = useStorage("token", ""); // JWT-token lagras i localStorage
const router = useRouter();

definePageMeta({
  layout: "auth",
});

/**
 * Hantera inloggning mot API:t
 */
const handleLogin = async () => {
  try {
    const res = await $fetch("http://localhost:5036/api/auth/login", {
      method: "POST",
      body: { username: username.value, password: password.value },
    });

    // Om inloggning lyckas, spara token och navigera till dashboard
    if (res && res.token) {
      token.value = res.token;
      await nextTick(); // Vänta på att token ska sparas i localStorage
      // Redirecta till dashboard
      router.push("/dashboard");
    } else {
      error.value = "Felaktigt svar från servern.";
    }
  } catch (err: any) {
    error.value = "Inloggning misslyckades. Kontrollera dina uppgifter.";
    console.error(err);
  }
};
</script>
