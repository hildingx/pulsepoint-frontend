<template>
  <form @submit.prevent="handleSubmit" aria-label="Hälsoregistreringsformulär">
    <h2>Ny hälsoregistrering</h2>

    <!-- Fält: Humör -->
    <div>
      <label for="mood">Humör: {{ mood }}</label>
      <input
        id="mood"
        type="range"
        v-model.number="mood"
        min="1"
        max="5"
        aria-label="Humör"
      />
      <p>Låg energi eller motivation = 1, positivt och energifylld = 5</p>
    </div>

    <!-- Fält: Sömn -->
    <div>
      <label for="sleep">Sömn: {{ sleep }}</label>
      <input
        id="sleep"
        type="range"
        v-model.number="sleep"
        min="1"
        max="5"
        aria-label="Sömn"
      />
      <p>Orolig eller otillräcklig sömn = 1, utvilad = 5</p>
    </div>

    <!-- Fält: Stress -->
    <div>
      <label for="stress">Stress: {{ stress }}</label>
      <input
        id="stress"
        type="range"
        v-model.number="stress"
        min="1"
        max="5"
        aria-label="Stress"
      />
      <p>Mycket stress = 1, lugn och fokuserad = 5</p>
    </div>

    <!-- Fält: Aktivitet -->
    <div>
      <label for="activity">Fysisk aktivitet: {{ activity }}</label>
      <input
        id="activity"
        type="range"
        v-model.number="activity"
        min="1"
        max="5"
        aria-label="Fysisk aktivitet"
      />
      <p>Inte rört dig alls = 1, mycket rörelse/träning = 5</p>
    </div>

    <!-- Fält: Kost -->
    <div>
      <label for="nutrition">Kost: {{ nutrition }}</label>
      <input
        id="nutrition"
        type="range"
        v-model.number="nutrition"
        min="1"
        max="5"
        aria-label="Kost"
      />
      <p>Oregelbundet/onyttigt = 1, balanserat och näringsrikt = 5</p>
    </div>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? "Sparar..." : "Spara" }}
    </button>

    <p v-if="error" style="color: red" role="alert">{{ error }}</p>
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
