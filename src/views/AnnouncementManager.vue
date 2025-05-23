<!-- views/AnnouncementManager.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">Announcement Management</h1>

        <v-card class="mb-8">
          <v-card-title class="bg-grey-lighten-3">
            <span class="text-h5">Create New Announcement</span>
          </v-card-title>

          <v-card-text class="pt-4">
            <v-form ref="form" @submit.prevent="submitAnnouncement">
              <v-text-field
                v-model="newAnnouncement.title"
                label="Announcement Title"
                required
                :rules="[(v) => !!v || 'Title is required']"
              ></v-text-field>

              <v-textarea
                v-model="newAnnouncement.content"
                label="Announcement Content"
                required
                :rules="[(v) => !!v || 'Content is required']"
                rows="5"
              ></v-textarea>

              <v-file-input
                v-model="announcementImage"
                label="Announcement Image (Optional)"
                accept="image/*"
                prepend-icon="mdi-camera"
                show-size
                truncate-length="25"
              ></v-file-input>

              <v-btn
                type="submit"
                color="black"
                class="mt-4"
                :loading="submitting"
                :disabled="submitting"
              >
                Publish Announcement
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <h2 class="text-h5 font-weight-bold mb-4">Your Announcements</h2>

        <v-data-table
          :headers="headers"
          :items="myAnnouncements"
          :loading="loading"
          class="elevation-1"
        >
          <!-- Fix v-slot syntax -->
          <template #[`item.created_at`]="{ item }">
            {{ formatDate(item.created_at) }}
          </template>

          <!-- Fix v-slot syntax -->
          <template #[`item.is_active`]="{ item }">
            <v-chip
              :color="item.is_active ? 'green' : 'grey'"
              text-color="white"
              size="small"
            >
              {{ item.is_active ? "Active" : "Inactive" }}
            </v-chip>
          </template>

          <!-- Fix v-slot syntax -->
          <template #[`item.actions`]="{ item }">
            <v-btn
              icon
              variant="text"
              color="blue-darken-1"
              @click="editAnnouncement(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              icon
              variant="text"
              color="red-darken-1"
              @click="confirmDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="700">
      <v-card v-if="editedAnnouncement">
        <v-card-title class="bg-grey-lighten-3">
          <span class="text-h5">Edit Announcement</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="editForm" @submit.prevent="updateAnnouncement">
            <v-text-field
              v-model="editedAnnouncement.title"
              label="Announcement Title"
              required
              :rules="[(v) => !!v || 'Title is required']"
            ></v-text-field>

            <v-textarea
              v-model="editedAnnouncement.content"
              label="Announcement Content"
              required
              :rules="[(v) => !!v || 'Content is required']"
              rows="5"
            ></v-textarea>

            <v-img
              v-if="editedAnnouncement.image_url"
              :src="editedAnnouncement.image_url"
              height="200"
              contain
              class="my-4 bg-grey-lighten-3"
            ></v-img>

            <v-file-input
              v-model="editImage"
              label="Replace Image (Optional)"
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              truncate-length="25"
            ></v-file-input>

            <v-switch
              v-model="editedAnnouncement.is_active"
              label="Active"
              color="black"
              hide-details
              class="mb-4"
            ></v-switch>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="editDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="black"
            @click="updateAnnouncement"
            :loading="submitting"
            :disabled="submitting"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Delete Announcement </v-card-title>

        <v-card-text>
          Are you sure you want to delete this announcement? This action cannot
          be undone.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red-darken-1"
            variant="text"
            @click="deleteAnnouncement"
            :loading="submitting"
            :disabled="submitting"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted } from "vue";
import {
  createAnnouncement,
  updateAnnouncement as updateAnnouncementApi,
  deleteAnnouncement as deleteAnnouncementApi,
  uploadAnnouncementImage,
  supabase,
} from "./supabase"; // Fixed path - assuming supabase.js is in the same directory

const form = ref(null);
const editForm = ref(null);
const loading = ref(true);
const submitting = ref(false);
const myAnnouncements = ref([]);
const announcementImage = ref(null);
const editImage = ref(null);
const editDialog = ref(false);
const deleteDialog = ref(false);
const editedAnnouncement = ref(null);
const announcementToDelete = ref(null);
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const newAnnouncement = ref({
  title: "",
  content: "",
});

const headers = [
  { title: "Title", key: "title" },
  { title: "Created", key: "created_at" },
  { title: "Status", key: "is_active" },
  { title: "Actions", key: "actions", sortable: false },
];

// We'll use this in a future implementation
// const currentUser = computed(() => {
//   return supabase.auth.user();
// });

onMounted(async () => {
  await fetchMyAnnouncements();
});

async function fetchMyAnnouncements() {
  loading.value = true;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    loading.value = false;
    return;
  }

  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("created_by", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching announcements:", error);
      showSnackbar("Failed to load announcements", "error");
    } else {
      myAnnouncements.value = data || [];
    }
  } catch (err) {
    console.error("Exception fetching announcements:", err);
    showSnackbar("Failed to load announcements", "error");
  }

  loading.value = false;
}

async function submitAnnouncement() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  submitting.value = true;
  let imageUrl = null;

  if (announcementImage.value) {
    const file = announcementImage.value;
    const { data: imageData, error: imageError } =
      await uploadAnnouncementImage(file);

    if (imageError) {
      console.error("Error uploading image:", imageError);
      showSnackbar("Failed to upload image", "error");
      submitting.value = false;
      return;
    }

    imageUrl = imageData.url;
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      showSnackbar("You must be logged in to publish.", "error");
      submitting.value = false;
      return;
    }

    const { error } = await createAnnouncement(
      newAnnouncement.value.title,
      newAnnouncement.value.content,
      imageUrl,
      session.user.id // <- pass user ID
    );

    if (error) {
      console.error("Error creating announcement:", error);
      showSnackbar("Failed to create announcement", "error");
    } else {
      showSnackbar("Announcement published successfully", "success");
      resetForm();
      await fetchMyAnnouncements();
    }
  } catch (err) {
    console.error("Exception creating announcement:", err);
    showSnackbar("Failed to create announcement", "error");
  }

  submitting.value = false;
}


function resetForm() {
  newAnnouncement.value = {
    title: "",
    content: "",
  };
  announcementImage.value = null;
  if (form.value) {
    form.value.reset();
  }
}

function editAnnouncement(announcement) {
  editedAnnouncement.value = { ...announcement };
  editImage.value = null;
  editDialog.value = true;
}

async function updateAnnouncement() {
  if (!editForm.value.validate()) return;

  submitting.value = true;
  let updates = {
    title: editedAnnouncement.value.title,
    content: editedAnnouncement.value.content,
    is_active: editedAnnouncement.value.is_active,
    updated_at: new Date().toISOString(),
  };

  // Upload new image if provided
  if (editImage.value && editImage.value.length > 0) {
    const file = editImage.value[0];
    const { data: imageData, error: imageError } =
      await uploadAnnouncementImage(file);

    if (imageError) {
      console.error("Error uploading image:", imageError);
      showSnackbar("Failed to upload image", "error");
      submitting.value = false;
      return;
    }

    updates.image_url = imageData.url;
  }

  try {
    const { error } = await supabase
      .from("announcements")
      .update(updates)
      .eq("id", editedAnnouncement.value.id);

    if (error) {
      console.error("Error updating announcement:", error);
      showSnackbar("Failed to update announcement", "error");
    } else {
      showSnackbar("Announcement updated successfully", "success");
      editDialog.value = false;
      await fetchMyAnnouncements();
    }
  } catch (err) {
    console.error("Exception updating announcement:", err);
    showSnackbar("Failed to update announcement", "error");
  }

  submitting.value = false;
}

function confirmDelete(announcement) {
  announcementToDelete.value = announcement;
  deleteDialog.value = true;
}

async function deleteAnnouncement() {
  submitting.value = true;

  try {
    const { error } = await deleteAnnouncementApi(
      announcementToDelete.value.id
    );

    if (error) {
      console.error("Error deleting announcement:", error);
      showSnackbar("Failed to delete announcement", "error");
    } else {
      showSnackbar("Announcement deleted successfully", "success");
      deleteDialog.value = false;
      await fetchMyAnnouncements();
    }
  } catch (err) {
    console.error("Exception deleting announcement:", err);
    showSnackbar("Failed to delete announcement", "error");
  }

  submitting.value = false;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function showSnackbar(text, color = "success") {
  snackbar.value = {
    show: true,
    text,
    color,
  };
}
</script>
