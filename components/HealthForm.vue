<template>
  <div>
    <h3>Ny hälsoregistrering</h3>

    <form @submit.prevent="handleSubmit">
      <div>
        <label>Humör (1-5):</label>
        <input type="number" v-model.number="mood" min="1" max="5" required />
      </div>

      <div>
        <label>Sömn (1-5):</label>
        <input type="number" v-model.number="sleep" min="1" max="5" required />
      </div>

      <div>
        <label>Stress (1-5):</label>
        <input type="number" v-model.number="stress" min="1" max="5" required />
      </div>

      <div>
        <label>Fysisk aktivitet (1-5):</label>
        <input
          type="number"
          v-model.number="activity"
          min="1"
          max="5"
          required
        />
      </div>

      <div>
        <label>Kost (1-5):</label>
        <input
          type="number"
          v-model.number="nutrition"
          min="1"
          max="5"
          required
        />
      </div>

      <button type="submit">Spara</button>
    </form>

    <p v-if="success" style="color: green">Registrering sparad!</p>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStorage } from "@vueuse/core";

const token = useStorage("token", "");

const mood = ref(3);
const sleep = ref(3);
const stress = ref(3);
const activity = ref(3);
const nutrition = ref(3);

const success = ref(false);
const error = ref("");

const handleSubmit = async () => {
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
    success.value = true;
    error.value = "";
    // Återställ formulär
    mood.value = 3;
    sleep.value = 3;
    stress.value = 3;
    activity.value = 3;
    nutrition.value = 3;
  } catch (err) {
    success.value = false;
    error.value = "Kunde inte spara registreringen.";
    console.error(err);
  }
};
</script>
