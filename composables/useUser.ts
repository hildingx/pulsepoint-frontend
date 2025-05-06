// composables/useUser.ts
import { useStorage } from "@vueuse/core";
import { watchEffect } from "vue";
import type { UserData } from "@/types/auth";

export function useUser() {
  const user = useState<UserData | null>("user", () => null);
  const token = useStorage("token", "");

  // Hämta användardata endast om det saknas men token finns
  watchEffect(async () => {
    if (!user.value && token.value) {
      try {
        const res = await $fetch<UserData>(
          "http://localhost:5036/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          }
        );
        user.value = res;
      } catch (err) {
        console.error("Misslyckades hämta användardata", err);
        token.value = "";
        user.value = null;
        navigateTo("/");
      }
    }
  });

  return {
    user,
    token,
  };
}
