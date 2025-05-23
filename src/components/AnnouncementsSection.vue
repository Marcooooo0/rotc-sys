<template>
  <v-container class="py-12 bg-grey-lighten-3">
    <v-row>
      <v-col cols="12" class="text-center mb-8">
        <h2 class="text-h3 font-weight-bold">Announcements</h2>
        <div class="mx-auto mt-4" style="max-width: 100px">
          <v-divider thickness="3" color="black"></v-divider>
        </div>
      </v-col>
    </v-row>
    
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="black"></v-progress-circular>
      </v-col>
    </v-row>
    
    <v-row v-else-if="announcements.length === 0">
      <v-col cols="12" class="text-center">
        <p class="text-body-1">No announcements available at this time.</p>
      </v-col>
    </v-row>
    
    <v-row v-else>
      <v-col v-for="announcement in announcements" :key="announcement.id" cols="12" md="4" class="mb-4">
        <v-card height="100%" class="d-flex flex-column">
          <v-img
            v-if="announcement.image_url"
            :src="announcement.image_url"
            height="200"
            cover
            class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          
          <v-card-title class="text-h5 font-weight-bold">{{ announcement.title }}</v-card-title>
          
          <v-card-text class="flex-grow-1">
            <p class="text-body-2 mb-2 text-grey">
              {{ formatDate(announcement.created_at) }}
            </p>
            <p class="text-body-1">{{ truncateText(announcement.content, 150) }}</p>
          </v-card-text>
          
          <v-card-actions>
            <v-btn
              color="black"
              variant="text"
              @click="showAnnouncementDialog(announcement)"
            >
              Read More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Announcement Detail Dialog -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card v-if="selectedAnnouncement">
        <v-img
          v-if="selectedAnnouncement.image_url"
          :src="selectedAnnouncement.image_url"
          height="300"
          cover
          class="bg-grey-lighten-2"
        ></v-img>
        
        <v-card-title class="text-h4 font-weight-bold pt-6 px-6">
          {{ selectedAnnouncement.title }}
        </v-card-title>
        
        <v-card-text class="px-6 py-4">
          <p class="text-body-2 mb-4 text-grey">
            {{ formatDate(selectedAnnouncement.created_at) }}
          </p>
          <p class="text-body-1 white-space-pre-line">{{ selectedAnnouncement.content }}</p>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn color="black" variant="text" @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted } from 'vue';
import { getAnnouncements } from '../views/supabase'; // Only import what we need

const announcements = ref([]);
const loading = ref(true);
const dialog = ref(false);
const selectedAnnouncement = ref(null);

onMounted(async () => {
  await fetchAnnouncements();
});

async function fetchAnnouncements() {
  loading.value = true;
  const { data, error } = await getAnnouncements();
  
  if (error) {
    console.error('Error fetching announcements:', error);
  } else {
    announcements.value = data || [];
  }
  
  loading.value = false;
}

function showAnnouncementDialog(announcement) {
  selectedAnnouncement.value = announcement;
  dialog.value = true;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
</script>

<style scoped>
.white-space-pre-line {
  white-space: pre-line;
}
</style>