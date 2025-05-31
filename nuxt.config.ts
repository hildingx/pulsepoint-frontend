// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
        },
      ],
      title: "PulsePoint - Hälsouppföljning för arbetsplatser",
      meta: [
        {
          name: "description",
          content:
            "PulsePoint är början på en plattform för att följa upp hälsan på arbetsplatser. Vi vill erbjuda verktyg för att mäta och förbättra medarbetares välbefinnande.",
        },
      ],
      htmlAttrs: {
        lang: "sv",
      },
    },
  },
});
