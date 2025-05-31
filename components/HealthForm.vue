<template>
  <form
    @submit.prevent="handleSubmit"
    aria-label="Hälsoregistreringsformulär"
    class="space-y-6 bg-white p-6 rounded shadow"
  >
    <h2 class="text-xl font-semibold text-gray-800">Hur mår du idag?</h2>

    <!-- Fält: Humör -->
    <div>
      <label for="mood" class="block font-medium text-gray-700 mb-1">
        Humör: {{ mood }}
      </label>
      <input
        id="mood"
        type="range"
        v-model.number="mood"
        min="1"
        max="5"
        class="w-full accent-sky-600"
        aria-label="Humör"
      />
      <p class="text-sm text-gray-500 mt-1">
        Låg energi eller motivation = 1, positivt och energifylld = 5
      </p>
    </div>

    <!-- Fält: Sömn -->
    <div>
      <label for="sleep" class="block font-medium text-gray-700 mb-1">
        Sömn: {{ sleep }}
      </label>
      <input
        id="sleep"
        type="range"
        v-model.number="sleep"
        min="1"
        max="5"
        class="w-full accent-sky-600"
        aria-label="Sömn"
      />
      <p class="text-sm text-gray-500 mt-1">
        Orolig eller otillräcklig sömn = 1, utvilad = 5
      </p>
    </div>

    <!-- Fält: Stress -->
    <div>
      <label for="stress" class="block font-medium text-gray-700 mb-1">
        Stress: {{ stress }}
      </label>
      <input
        id="stress"
        type="range"
        v-model.number="stress"
        min="1"
        max="5"
        class="w-full accent-sky-600"
        aria-label="Stress"
      />
      <p class="text-sm text-gray-500 mt-1">
        Mycket stress = 1, lugn och fokuserad = 5
      </p>
    </div>

    <!-- Fält: Aktivitet -->
    <div>
      <label for="activity" class="block font-medium text-gray-700 mb-1">
        Fysisk aktivitet: {{ activity }}
      </label>
      <input
        id="activity"
        type="range"
        v-model.number="activity"
        min="1"
        max="5"
        class="w-full accent-sky-600"
        aria-label="Fysisk aktivitet"
      />
      <p class="text-sm text-gray-500 mt-1">
        Inte rört dig alls = 1, mycket rörelse/träning = 5
      </p>
    </div>

    <!-- Fält: Kost -->
    <div>
      <label for="nutrition" class="block font-medium text-gray-700 mb-1">
        Kost: {{ nutrition }}
      </label>
      <input
        id="nutrition"
        type="range"
        v-model.number="nutrition"
        min="1"
        max="5"
        class="w-full accent-sky-600"
        aria-label="Kost"
      />
      <p class="text-sm text-gray-500 mt-1">
        Oregelbundet/onyttigt = 1, balanserat och näringsrikt = 5
      </p>
    </div>

    <!-- Submit-knapp -->
    <button
      type="submit"
      :disabled="isSubmitting"
      class="mx-auto block bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700 disabled:opacity-50"
    >
      {{ isSubmitting ? "Sparar..." : "Spara" }}
    </button>

    <!-- Felmeddelande -->
    <p v-if="error" class="text-red-600 text-sm text-center" role="alert">
      {{ error }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStorage } from "@vueuse/core";

const token = useStorage("token", "");

// Formfält (range 1–5)
const mood = ref<number>(3);
const sleep = ref<number>(3);
const stress = ref<number>(3);
const activity = ref<number>(3);
const nutrition = ref<number>(3);

// Felmeddelande
const error = ref("");
const isSubmitting = ref(false);

// Eventemitter
const emit = defineEmits<{
  (e: "submitted"): void;
}>();

/**
 * Skickar hälsoregistrering till API
 */
const handleSubmit = async (): Promise<void> => {
  isSubmitting.value = true;

  try {
    await $fetch("http://localhost:5036/api/healthentries", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: {
        mood: mood.value,
        sleep: sleep.value,
        stress: stress.value,
        activity: activity.value,
        nutrition: nutrition.value,
      },
    });

    error.value = "";
    emit("submitted");
  } catch (err: any) {
    error.value = err?.data?.message || "Kunde inte spara registreringen.";
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
