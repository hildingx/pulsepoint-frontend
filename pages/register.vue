<template>
  <div>
    <h2>Skapa konto</h2>

    <!-- Registreringsformulär -->
    <form
      v-if="!success"
      @submit.prevent="handleRegister"
      aria-label="Registreringsformulär"
    >
      <!-- Förnamn -->
      <div>
        <label for="firstName">Förnamn</label>
        <input
          id="firstName"
          v-model="firstName"
          required
          aria-required="true"
          aria-label="Förnamn"
        />
      </div>

      <!-- Efternamn -->
      <div>
        <label for="lastName">Efternamn</label>
        <input
          id="lastName"
          v-model="lastName"
          required
          aria-required="true"
          aria-label="Efternamn"
        />
      </div>

      <!-- Användarnamn med felmeddelanden -->
      <div>
        <label for="username">Användarnamn</label>
        <input
          id="username"
          v-model="username"
          required
          aria-required="true"
          aria-label="Användarnamn"
        />
        <ul v-if="triedToSubmit && usernameErrors.length" style="color: red">
          <li v-for="(err, i) in usernameErrors" :key="i">{{ err }}</li>
        </ul>
      </div>

      <!-- Lösenord med felmeddelanden -->
      <div>
        <label for="password">Lösenord</label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          aria-required="true"
          aria-label="Lösenord"
        />
        <ul v-if="triedToSubmit && passwordErrors.length" style="color: red">
          <li v-for="(err, i) in passwordErrors" :key="i">{{ err }}</li>
        </ul>
      </div>

      <!-- Välj arbetsplats -->
      <div>
        <label for="workplace">Arbetsplats</label>
        <select
          id="workplace"
          v-model="workplaceId"
          required
          aria-required="true"
          aria-label="Arbetsplats"
        >
          <option disabled value="">Välj arbetsplats</option>
          <option v-for="wp in workplaces" :key="wp.id" :value="wp.id">
            {{ wp.name }}
          </option>
        </select>
      </div>

      <!-- Submit-knapp med loading-state och aktiveringslogik -->
      <button
        type="submit"
        :disabled="isLoading || !hasAllFieldsFilled"
        :aria-disabled="isLoading ? 'true' : 'false'"
      >
        {{ isLoading ? "Registrerar…" : "Registrera" }}
      </button>
    </form>

    <!-- Bekräftelsemeddelande -->
    <p v-if="success" style="color: green">
      Kontot har skapats! Du kan nu <NuxtLink to="/">logga in.</NuxtLink>
    </p>

    <!-- Felmeddelande vid misslyckad registrering -->
    <p v-if="error" style="color: red" role="alert">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuth } from "@/composables/useAuth";

definePageMeta({
  layout: "auth",
});

// Formulärfält (typade)
const username = ref<string>("");
const password = ref<string>("");
const firstName = ref<string>("");
const lastName = ref<string>("");
const workplaceId = ref<number | "">("");

// Auth-status och API-funktioner
const { register, registerSuccess: success, registerError: error } = useAuth();
const isLoading = ref(false);

// Visar valideringsfel först efter försök att registrera
const triedToSubmit = ref(false);

// Kollar att alla fält är ifyllda (för att aktivera knappen)
const hasAllFieldsFilled = computed(
  () =>
    username.value &&
    password.value &&
    firstName.value &&
    lastName.value &&
    workplaceId.value
);

// Lösenordsvalidering enligt backendkrav
const passwordErrors = computed(() => {
  const errors: string[] = [];
  if (password.value.length < 6) {
    errors.push("Minst 6 tecken");
  }
  if (!/[a-z]/.test(password.value)) {
    errors.push("Minst en liten bokstav");
  }
  if (!/[0-9]/.test(password.value)) {
    errors.push("Minst en siffra");
  }
  return errors;
});

// Användarnamnsvalidering (minst 3 tecken)
const usernameErrors = computed(() => {
  const errors: string[] = [];
  if (username.value.length < 3) {
    errors.push("Minst 3 tecken");
  }
  return errors;
});

// Fullständig validering innan API-anrop
const isFormValid = computed(
  () =>
    username.value &&
    password.value &&
    firstName.value &&
    lastName.value &&
    workplaceId.value &&
    usernameErrors.value.length === 0 &&
    passwordErrors.value.length === 0
);

// Skickar registreringsdata till backend om formuläret är giltigt
const handleRegister = async () => {
  triedToSubmit.value = true;

  if (!isFormValid.value) return;

  isLoading.value = true;
  try {
    await register({
      username: username.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      workplaceId: Number(workplaceId.value),
    });
  } finally {
    isLoading.value = false;
  }
};

// Interface för arbetsplatser
interface Workplace {
  id: number;
  name: string;
}

// Hämta tillgängliga arbetsplatser från API
const { data: workplacesData } = await useFetch<Workplace[]>(
  "http://localhost:5036/api/workplaces",
  {
    server: false,
  }
);

// Säkerställ att listan är alltid en array
const workplaces = computed(() => workplacesData.value ?? []);
</script>
