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
      <v-col v-for="(announcement, index) in announcements" :key="announcement.id" cols="12" md="4" class="mb-4">
        <v-card height="100%" class="d-flex flex-column">
          <!-- Static Local Image Display -->
          <v-img
            :src="getAnnouncementImage(index)"
            height="200"
            cover
            class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
              </v-row>
            </template>
            
            <!-- Overlay with announcement type badge -->
            <div class="image-overlay">
              <v-chip
                :color="getAnnouncementTypeColor(index)"
                text-color="white"
                size="small"
                class="ma-2"
              >
                {{ getAnnouncementType(index) }}
              </v-chip>
            </div>
          </v-img>
          
          <v-card-title class="text-h5 font-weight-bold">{{ announcement.title }}</v-card-title>
          
          <v-card-text class="flex-grow-1">
            <p class="text-body-2 mb-2 text-grey">
              {{ formatDate(announcement.created_at) }}
            </p>
            <p class="text-body-1">{{ truncateText(announcement.content, 120) }}</p>
          </v-card-text>
          
          <v-card-actions>
            <v-btn
              color="black"
              variant="text"
              @click="showAnnouncementDialog(announcement, index)"
            >
              Read More
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              icon
              variant="text"
              color="grey"
              size="small"
            >
              <v-icon>mdi-bookmark-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Announcement Detail Dialog -->
    <v-dialog v-model="dialog" max-width="800">
      <v-card v-if="selectedAnnouncement">
        <!-- Hero Image in Dialog -->
        <v-img
          :src="getAnnouncementImage(selectedAnnouncementIndex)"
          height="250"
          cover
          class="bg-grey-lighten-2"
        >
          <div class="image-overlay">
            <v-chip
              :color="getAnnouncementTypeColor(selectedAnnouncementIndex)"
              text-color="white"
              size="large"
              class="ma-4"
            >
              {{ getAnnouncementType(selectedAnnouncementIndex) }}
            </v-chip>
          </div>
        </v-img>
        
        <v-card-title class="text-h4 font-weight-bold pt-6 px-6">
          {{ selectedAnnouncement.title }}
        </v-card-title>
        
        <v-card-text class="px-6 py-4">
          <div class="d-flex align-center mb-4">
            <v-icon color="grey" class="mr-2">mdi-calendar</v-icon>
            <p class="text-body-2 text-grey mb-0">
              {{ formatDate(selectedAnnouncement.created_at) }}
            </p>
            <v-spacer></v-spacer>
            <v-chip
              color="green"
              text-color="white"
              size="small"
            >
              Active
            </v-chip>
          </div>
          <v-divider class="mb-4"></v-divider>
          <p class="text-body-1 white-space-pre-line">{{ selectedAnnouncement.content }}</p>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-btn
            color="grey"
            variant="outlined"
            prepend-icon="mdi-share-variant"
          >
            Share
          </v-btn>
          <v-btn
            color="grey"
            variant="outlined"
            prepend-icon="mdi-bookmark-outline"
          >
            Save
          </v-btn>
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
import { ref, onMounted } from 'vue';
import { getAnnouncements } from '../views/supabase';

const announcements = ref([]);
const loading = ref(true);
const dialog = ref(false);
const selectedAnnouncement = ref(null);
const selectedAnnouncementIndex = ref(0);

const announcementTypes = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
];

const typeColors = [
  'blue-darken-2',
  'green-darken-2',
  'orange-darken-2',
  'purple-darken-2',
  'red-darken-2',
  'teal-darken-2',
  'pink-darken-2',
  'indigo-darken-2'
];

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

function showAnnouncementDialog(announcement, index) {
  selectedAnnouncement.value = announcement;
  selectedAnnouncementIndex.value = index;
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

const announcementImages = [
  "ann1.jpg",
  "ann2.jpg",
  "ann3.jpeg",
  "ann4.jpg", 
  "ann5.jpg",
];
// Get local image based on announcement index (cycles through ann1.png to ann5.png)
function getAnnouncementImage(index) {
  const imageName = announcementImages[index % announcementImages.length];
  return `/${imageName}`;
}

// Get announcement type based on index
function getAnnouncementType(index) {
  const typeIndex = index % announcementTypes.length;
  return announcementTypes[typeIndex];
}

// Get announcement type color based on index
function getAnnouncementTypeColor(index) {
  const colorIndex = index % typeColors.length;
  return typeColors[colorIndex];
}
</script>

<style scoped>
.white-space-pre-line {
  white-space: pre-line;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 50%);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.v-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.v-img {
  border-radius: 4px 4px 0 0;
}
</style>