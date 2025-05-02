// composables/useAuth.ts
import { useStorage } from "@vueuse/core";

export function useAuth() {
  const token = useStorage("token", "");
  const error = ref("");
  const registerError = ref("");
  const registerSuccess = ref(false);

  /**
   * Inloggning – spara token + redirect
   */
  const login = async (username: string, password: string) => {
    try {
      const res = await $fetch<{ token: string }>(
        "http://localhost:5036/api/auth/login",
        {
          method: "POST",
          body: { username, password },
        }
      );

      token.value = res.token;
      error.value = "";
      await nextTick();
      navigateTo("/dashboard");
    } catch (err) {
      error.value = "Inloggning misslyckades. Kontrollera dina uppgifter.";
      console.error(err);
    }
  };

  /**
   * Registrera ny användare (POST /auth/register)
   */
  const register = async (user: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    workplaceId: number;
  }) => {
    try {
      await $fetch("http://localhost:5036/api/auth/register", {
        method: "POST",
        body: user,
      });

      registerSuccess.value = true;
      registerError.value = "";
    } catch (err) {
      registerError.value =
        "Registrering misslyckades. Kontrollera uppgifterna.";
      registerSuccess.value = false;
      console.error(err);
    }
  };

  // Logga ut: ta bort token och redirecta till login
  const logout = () => {
    token.value = "";
    navigateTo("/");
  };

  // Returnera allt vi vill exponera
  return {
    token,
    login,
    logout,
    error,
    register,
    registerError,
    registerSuccess,
  };
}
