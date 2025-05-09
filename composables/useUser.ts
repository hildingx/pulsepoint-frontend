// composables/useUser.ts
import { useStorage } from "@vueuse/core";
import { watchEffect } from "vue";
import type { UserData } from "@/types/auth";

/**
 * Returnerar global användarstate och token.
 * Om token finns men user saknas, hämtas användarinfo från /auth/me
 */
export function useUser() {
  const user = useState<UserData | null>("user", () => null);
  const token = useStorage("token", "");

  /**
   * Hämtar användarinfo om det behövs
   */
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
      }
    }
  });

  return {
    user,
    token,
  };
}
