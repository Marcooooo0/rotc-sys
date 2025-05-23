<template>
  <v-app>
    <!-- Hero Section -->
    <v-parallax
      src="https://media.gettyimages.com/id/1505054811/photo/philippine-armed-forces-chief-visits-batanes-islands-caught-in-u-s-china-crosshairs.jpg?s=2048x2048&w=gi&k=20&c=tKPnp6gvXhLnaWC5t2ozC1FgiKiq_ve490xkdDbc4XU="
      height="600"
    >
      <div
        class="d-flex flex-column fill-height justify-center align-center text-white"
      >
        <h1 class="text-h2 font-weight-bold text-center mb-4">
          ROTC Management System
        </h1>
        <h2 class="text-h4 font-weight-regular text-center mb-8">
          Streamlining ROTC Operations in the Philippines
        </h2>
        <v-btn color="white" size="large" class="mt-4 text-black" variant="elevated" style="position: relative; z-index: 2;" to="/auth">
          Get Started
        </v-btn>
      </div>
    </v-parallax>

    <!-- Announcements Section -->
    <AnnouncementsSection />

    <!-- About Section -->
    <v-container class="py-12">
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="text-h3 font-weight-bold">Welcome To ROTC Sys</h2>
          <div class="mx-auto mt-4" style="max-width: 100px">
            <v-divider thickness="3" color="black"></v-divider>
          </div>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-img src="/bg1.jpg" height="auto" cover class="rounded-lg"></v-img>
        </v-col>
        <v-col cols="12" md="6">
          <h3 class="text-h5 font-weight-bold mb-4">What is ROTC Sys?</h3>
          <p class="text-body-1 mb-4 text-justify">
            The ROTC Management System was conceptualized to digitize and
            streamline the administrative and academic operations of the Reserve
            Officers' Training Corps (ROTC). Traditionally, managing cadet
            records, grades, schedules, and communications relied heavily on
            manual processes, leading to inefficiencies and data handling
            challenges.
          </p>
          <p class="text-body-1 mb-4 text-justify">
            This system addresses these pain points by providing a centralized platform 
            that supports cadets, ROTC officers, and admin staff in managing academic data, 
            communication, and operational logistics in a secure and accessible manner in our campus Caraga State University.
          </p>
          <v-btn
            color="black"
            variant="outlined"
            class="mt-2"
            :href="rotcHistoryLink"
            target="_blank"
          >
            Learn More
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Rest of your existing sections... -->
  </v-app>
</template>

<script setup>
// Vue 3 Composition API
import { ref, defineComponent } from 'vue';
import AnnouncementsSection from '@/components/AnnouncementsSection.vue';

// Explicitly define the component to avoid potential mounting issues
defineComponent({
  name: 'LandingPage'
});

// Data - renamed to make it clear what it's for and ensure it's used
const rotcHistoryLink = ref("https://kahimyang.com/kauswagan/articles/2431/the-history-of-the-reserve-officer-training-corp-in-the-philippines");
</script>

<style scoped>
/* Additional custom styles can be added here */
.v-parallax {
  position: relative;
}

.v-parallax::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.v-parallax__content {
  z-index: 2;
  position: relative;
}

/* Black and white theme overrides */
:deep(.v-card) {
  border: 1px solid #e0e0e0;
}

:deep(.v-timeline-item__dot) {
  background-color: black !important;
}
</style>