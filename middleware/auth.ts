// middleware/auth.ts
import { useStorage } from "@vueuse/core";

export default defineNuxtRouteMiddleware(() => {
  const token = useStorage("token", "");

  // Delay redirect tills token finns
  if (import.meta.client && !token.value) {
    return navigateTo("/");
  }
});
