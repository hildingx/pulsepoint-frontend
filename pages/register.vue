<template>
  <div>
    <h2 v-if="!success" class="text-2xl font-bold mb-6 text-center">
      Skapa konto
    </h2>

    <form
      v-if="!success"
      @submit.prevent="handleRegister"
      aria-label="Registreringsformulär"
      class="space-y-4"
    >
      <!-- Förnamn -->
      <div>
        <label for="firstName" class="block mb-1 text-sm font-medium"
          >Förnamn</label
        >
        <input
          id="firstName"
          v-model="firstName"
          required
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <!-- Efternamn -->
      <div>
        <label for="lastName" class="block mb-1 text-sm font-medium"
          >Efternamn</label
        >
        <input
          id="lastName"
          v-model="lastName"
          required
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <!-- Användarnamn -->
      <div>
        <label for="username" class="block mb-1 text-sm font-medium"
          >Användarnamn</label
        >
        <input
          id="username"
          v-model="username"
          required
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <ul
          v-if="triedToSubmit && usernameErrors.length"
          class="text-red-600 text-sm mt-1"
        >
          <li v-for="(err, i) in usernameErrors" :key="i">{{ err }}</li>
        </ul>
      </div>

      <!-- Lösenord -->
      <div>
        <label for="password" class="block mb-1 text-sm font-medium"
          >Lösenord</label
        >
        <input
          id="password"
          type="password"
          v-model="password"
          required
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <ul
          v-if="triedToSubmit && passwordErrors.length"
          class="text-red-600 text-sm mt-1"
        >
          <li v-for="(err, i) in passwordErrors" :key="i">{{ err }}</li>
        </ul>
      </div>

      <!-- Arbetsplats -->
      <div>
        <label for="workplace" class="block mb-1 text-sm font-medium"
          >Arbetsplats</label
        >
        <select
          id="workplace"
          v-model="workplaceId"
          required
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option disabled value="">Välj arbetsplats</option>
          <option v-for="wp in workplaces" :key="wp.id" :value="wp.id">
            {{ wp.name }}
          </option>
        </select>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="isLoading || !hasAllFieldsFilled"
        class="block mx-auto w-full max-w-[150px] bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ isLoading ? "Registrerar…" : "Registrera" }}
      </button>
    </form>

    <!-- Bekräftelse -->
    <p v-if="success" class="text-green-600 mt-4 text-center">
      Kontot har skapats! Du kan nu
      <NuxtLink to="/" class="text-blue-600 underline">logga in.</NuxtLink>
    </p>

    <!-- Felmeddelande -->
    <p v-if="error" class="text-red-600 mt-2 text-center" role="alert">
      {{ error }}
    </p>
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
