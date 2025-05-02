<template>
  <form @submit.prevent="handleSubmit">
    <h3>Ny hälsoregistrering</h3>

    <div>
      <label>Humör: {{ mood }}</label>
      <input type="range" v-model.number="mood" min="1" max="5" />
      <p>Låg energi eller motivation = 1, positivt och energifylld = 5</p>
    </div>

    <div>
      <label>Sömn: {{ sleep }}</label>
      <input type="range" v-model.number="sleep" min="1" max="5" />
      <p>Orolig eller otillräcklig sömn = 1, utvilad = 5</p>
    </div>

    <div>
      <label>Stress: {{ stress }}</label>
      <input type="range" v-model.number="stress" min="1" max="5" />
      <p>Mycket stress = 1, lugn och fokuserad = 5</p>
    </div>

    <div>
      <label>Fysisk aktivitet: {{ activity }}</label>
      <input type="range" v-model.number="activity" min="1" max="5" />
      <p>Inte rört dig alls = 1, mycket rörelse/träning = 5</p>
    </div>

    <div>
      <label>Kost: {{ nutrition }}</label>
      <input type="range" v-model.number="nutrition" min="1" max="5" />
      <p>Oregelbundet/onyttigt = 1, balanserat och näringsrikt = 5</p>
    </div>

    <button type="submit">Spara</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
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

const error = ref("");

const emit = defineEmits<{
  (e: "submitted"): void;
}>();

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

    error.value = "";
    emit("submitted");
  } catch (err) {
    error.value = "Kunde inte spara registreringen.";
    console.error(err);
  }
};
</script>
