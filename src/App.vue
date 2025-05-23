<template>
  <v-app>
    <!-- Show App Bar only when not on the landing page or auth page -->
    <v-app-bar v-if="!isLandingPage && !isAuthPage && !isHomePage" app>
      <v-toolbar-title>ROTC Sys</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Back</v-btn>
      <v-btn text @click="handleLogout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <!-- This is where the landing page and other pages are injected -->
      <router-view />
    </v-main>

    <!-- Snackbar for showing messages -->
    <v-snackbar v-model="snackbarVisible" :timeout="3000" color="success">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>

<script>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router"; // Import useRouter
import { logout } from "./views/supabase";

export default {
  name: "App",
  setup() {
    const route = useRoute(); // Access the current route
    const router = useRouter(); // Access the router instance
    const snackbarVisible = ref(false);
    const snackbarMessage = ref("");

    // Check if the current route is the landing page
    const isLandingPage = computed(() => {
      return route.path === "/";
    });

    // Check if the current route is the auth page
    const isAuthPage = computed(() => {
      return route.path === "/auth";
    });

    const isHomePage = computed(() => {
      return route.path === "/home";
    });

    const handleLogout = async () => {
      try {
        await logout(); // Call the logout function
        // Redirect to the login page after logout
        router.push("/auth");
      } catch (error) {
        console.error("Logout error:", error);
        snackbarMessage.value = "Logout Successful"; // Set the message
        snackbarVisible.value = true; // Show the snackbar
      }
    };

    return {
      isLandingPage,
      isAuthPage,
      isHomePage,
      handleLogout,
      snackbarVisible,
      snackbarMessage,
    };
  },
};
</script>

<style scoped>
.v-app-bar {
  background: black;
  color: white;
}
</style>
