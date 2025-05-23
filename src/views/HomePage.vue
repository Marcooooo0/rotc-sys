<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="black" density="compact" flat>
      <v-app-bar-title class="text-white font-weight-bold"
        >ROTC SYS</v-app-bar-title
      >
      <v-spacer></v-spacer>
      <v-btn icon class="text-white" @click="toggleNotifications">
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon class="text-white" @click="toggleChat">
        <v-badge
          :content="unreadCount.toString()"
          :value="hasUnreadMessages"
          color="red"
          offset-x="3"
          offset-y="3"
        >
          <v-icon>mdi-message-text</v-icon>
        </v-badge>
      </v-btn>
      <v-btn icon class="text-white">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-btn icon class="text-red" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <!-- Hero Section -->
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-sheet
              class="d-flex flex-column justify-center align-center text-center pa-12"
              color="grey-lighten-4"
              min-height="300"
            >
              <h1 class="text-h3 font-weight-bold mb-4">
                Welcome to ROTC Management System
              </h1>
              <p class="text-body-1 mb-6 max-width-800">
                A comprehensive platform designed to digitize and streamline the
                administrative and academic operations of the Reserve Officers'
                Training Corps.
              </p>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>

      <!-- Dashboard Overview -->
      <v-container class="py-8">
        <v-row>
          <v-col cols="12">
            <h2 class="text-h4 font-weight-bold mb-6">Dashboard Overview</h2>
          </v-col>
        </v-row>

        <v-row>
          <!-- Stats Cards -->
          <v-col cols="12" md="3">
            <v-card class="mb-4" variant="outlined">
              <v-card-text class="d-flex align-center">
                <v-icon size="x-large" color="black" class="mr-4"
                  >mdi-account-group</v-icon
                >
                <div>
                  <div class="text-h5 font-weight-bold">2</div>
                  <div class="text-caption">Total Cadets</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card class="mb-4" variant="outlined">
              <v-card-text class="d-flex align-center">
                <v-icon size="x-large" color="black" class="mr-4"
                  >mdi-calendar-check</v-icon
                >
                <div>
                  <div class="text-h5 font-weight-bold">3</div>
                  <div class="text-caption">Upcoming Events</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card class="mb-4" variant="outlined">
              <v-card-text class="d-flex align-center">
                <v-icon size="x-large" color="black" class="mr-4"
                  >mdi-clipboard-text</v-icon
                >
                <div>
                  <div class="text-h5 font-weight-bold">0%</div>
                  <div class="text-caption">Attendance Rate</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card class="mb-4" variant="outlined" @click="toggleChat">
              <v-card-text class="d-flex align-center">
                <v-icon size="x-large" color="black" class="mr-4"
                  >mdi-message-text</v-icon
                >
                <div>
                  <div class="text-h5 font-weight-bold">{{ unreadCount }}</div>
                  <div class="text-caption">New Messages</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Announcements Section -->
      <AnnouncementSection />
      
      <!-- Announcement Manager (Only visible to officers) -->
      <v-container v-if="isOfficer" class="py-8">
        <v-row>
          <v-col cols="12">
            <v-card>
              <!-- <v-card-title class="bg-grey-lighten-3"> -->
                <!-- <h2 class="text-h4 font-weight-bold"></h2> -->
              <!-- </v-card-title> -->
              <v-card-text>
                <AnnouncementManager />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Quick Access -->
      <v-container class="py-8 bg-grey-lighten-4">
        <v-row>
          <v-col cols="12">
            <h2 class="text-h4 font-weight-bold mb-6">Quick Access</h2>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6" md="3">
            <v-card class="text-center pa-4" height="100%" variant="flat">
              <v-icon size="x-large" color="black" class="mb-2"
                >mdi-calendar</v-icon
              >
              <div class="text-body-1 font-weight-medium">Schedule</div>
            </v-card>
          </v-col>

          <v-col cols="6" md="3">
            <v-card class="text-center pa-4" height="100%" variant="flat">
              <v-icon size="x-large" color="black" class="mb-2"
                >mdi-file-document</v-icon
              >
              <div class="text-body-1 font-weight-medium">Documents</div>
            </v-card>
          </v-col>

          <v-col cols="6" md="3">
            <v-card class="text-center pa-4" height="100%" variant="flat">
              <v-icon size="x-large" color="black" class="mb-2"
                >mdi-account-group</v-icon
              >
              <div class="text-body-1 font-weight-medium">Cadets</div>
            </v-card>
          </v-col>

          <v-col cols="6" md="3">
            <v-card class="text-center pa-4" height="100%" variant="flat">
              <v-icon size="x-large" color="black" class="mb-2"
                >mdi-chart-bar</v-icon
              >
              <div class="text-body-1 font-weight-medium">Grade</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Chat Navigation Drawer -->
    <v-navigation-drawer
      v-model="chatDrawer"
      location="right"
      temporary
      width="320"
      class="chat-drawer"
    >
      <v-toolbar color="black" class="text-white">
        <v-toolbar-title>Messages</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="showNewMessageDialog = true">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="chatDrawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list>
        <v-list-subheader>Recent Conversations</v-list-subheader>
        
        <v-list-item
          v-for="contact in contacts"
          :key="contact.id"
          @click="openChat(contact)"
          :active="selectedContact && selectedContact.id === contact.id"
          :class="{ 'unread': contact.unread }"
        >
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1" class="mr-3">
              <v-img v-if="contact.avatar" :src="contact.avatar"></v-img>
              <span v-else class="text-h6">{{ getInitials(contact.name) }}</span>
            </v-avatar>
          </template>

          <v-list-item-title>{{ contact.name }}</v-list-item-title>
          <v-list-item-subtitle class="text-truncate">
            {{ contact.lastMessage }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <div class="d-flex flex-column align-end">
              <span class="text-caption text-grey">{{ formatTime(contact.timestamp) }}</span>
              <v-badge
                v-if="contact.unread"
                color="red"
                :content="contact.unreadCount.toString()"
                inline
              ></v-badge>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Chat Window -->
    <v-dialog
      v-model="chatOpen"
      max-width="500px"
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card class="chat-window">
        <v-toolbar color="black" class="text-white">
          <v-btn icon @click="minimizeChat">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-toolbar-title v-if="selectedContact">
            {{ selectedContact.name }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeChat">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="chat-messages pa-0">
          <div class="messages-container pa-4" ref="messagesContainer">
            <template v-if="messages.length">
              <div
                v-for="(message, index) in messages"
                :key="index"
                :class="[
                  'message-bubble mb-2 pa-2',
                  message.senderId === currentUser.id ? 'sent' : 'received'
                ]"
              >
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div class="message-time text-caption text-grey">
                  {{ formatTime(message.timestamp) }}
                </div>
              </div>
            </template>
            <div v-else class="text-center py-8 text-grey">
              No messages yet. Start the conversation!
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-2">
          <v-text-field
            v-model="newMessage"
            placeholder="Type a message..."
            variant="outlined"
            density="compact"
            hide-details
            @keyup.enter="sendMessage"
            class="mr-2"
          ></v-text-field>
          <v-btn color="black" icon @click="sendMessage">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- New Message Dialog -->
    <v-dialog v-model="showNewMessageDialog" max-width="500px">
      <v-card>
        <v-card-title>New Message</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="newChatUser"
            :items="availableUsers"
            item-title="name"
            item-value="id"
            label="Select a user"
            placeholder="Search for a user"
            return-object
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar color="grey-lighten-1" size="32">
                    <v-img v-if="item.raw.avatar" :src="item.raw.avatar"></v-img>
                    <span v-else class="text-caption">{{ getInitials(item.raw.name) }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.role }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showNewMessageDialog = false">
            Cancel
          </v-btn>
          <v-btn color="black" variant="flat" @click="startNewChat" :disabled="!newChatUser">
            Start Chat
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Minimized Chat Bubbles -->
    <div class="minimized-chats">
      <div 
        v-for="chat in minimizedChats" 
        :key="chat.id"
        class="minimized-chat-bubble"
        @click="maximizeChat(chat)"
      >
        <v-avatar color="black" size="48">
          <v-img v-if="chat.avatar" :src="chat.avatar"></v-img>
          <span v-else class="text-white">{{ getInitials(chat.name) }}</span>
        </v-avatar>
        <v-badge
          v-if="chat.unread"
          color="red"
          dot
          location="bottom end"
          offset-x="3"
          offset-y="3"
        ></v-badge>
      </div>
    </div>

    <!-- Footer -->
    <v-footer class="bg-black text-center d-flex flex-column">
      <div class="text-white">
        &copy; {{ new Date().getFullYear() }} ROTC Management System
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { supabase } from "./supabase"; // Adjust the import path as necessary
import { useRouter } from "vue-router";
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import AnnouncementSection from '../components/AnnouncementsSection.vue'; // Adjust path as needed
import AnnouncementManager from '../views/AnnouncementManager.vue'; // Adjust path as needed

// Get router instance
const router = useRouter();

// User role state
const userRole = ref('');
const isOfficer = computed(() => {
  console.log('Current userRole:', userRole.value);
  return userRole.value.toLowerCase() === 'officer';
});

// Get user role from Supabase
const getUserRole = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No session found');
      return null;
    }
    
    console.log('User metadata:', session.user.user_metadata);
    
    // Get role directly from user metadata (matching your router)
    const roleFromMetadata = session.user.user_metadata?.role;
    if (roleFromMetadata) {
      console.log('Role from metadata:', roleFromMetadata);
      return roleFromMetadata;
    }
    
    // Fallback to profiles table if needed
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user role from profiles:', error);
      return null;
    }
    
    console.log('Role from profiles table:', data?.role);
    return data?.role || null;
  } catch (err) {
    console.error('Exception fetching user role:', err);
    return null;
  }
};

// Chat state
const chatDrawer = ref(false);
const chatOpen = ref(false);
const selectedContact = ref(null);
const messages = ref([]);
const newMessage = ref('');
const minimizedChats = ref([]);
const showNewMessageDialog = ref(false);
const newChatUser = ref(null);
const notificationsOpen = ref(false);

// Current user (would normally come from auth)
const currentUser = ref({
  id: '1',
  name: 'Current User',
  role: 'Officer'
});

// Mock contacts data (would normally come from Supabase)
const contacts = ref([
  {
    id: '2',
    name: 'John Doe',
    role: 'Officer',
    lastMessage: 'When is the next training session?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: true,
    unreadCount: 2,
    avatar: null
  },
  {
    id: '3',
    name: 'Jane Smith',
    role: 'Cadet',
    lastMessage: 'I submitted my assignment',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: false,
    unreadCount: 0,
    avatar: null
  },
  {
    id: '4',
    name: 'Robert Johnson',
    role: 'Officer',
    lastMessage: 'Please review the new schedule',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: true,
    unreadCount: 1,
    avatar: null
  },
  {
    id: '5',
    name: 'Maria Garcia',
    role: 'Cadet',
    lastMessage: 'Thank you for the feedback',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: false,
    unreadCount: 0,
    avatar: null
  }
]);

// Mock available users for new chat
const availableUsers = ref([
  {
    id: '2',
    name: 'John Doe',
    role: 'Officer',
    avatar: null
  },
  {
    id: '3',
    name: 'Jane Smith',
    role: 'Cadet',
    avatar: null
  },
  {
    id: '4',
    name: 'Robert Johnson',
    role: 'Officer',
    avatar: null
  },
  {
    id: '5',
    name: 'Maria Garcia',
    role: 'Cadet',
    avatar: null
  },
  {
    id: '6',
    name: 'David Wilson',
    role: 'Officer',
    avatar: null
  },
  {
    id: '7',
    name: 'Sarah Brown',
    role: 'Cadet',
    avatar: null
  }
]);

// Mock message history (would normally come from Supabase)
const messageHistory = ref({
  '2': [
    {
      id: '1',
      senderId: '2',
      receiverId: '1',
      content: 'Hello, when is the next training session?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      read: false
    },
    {
      id: '2',
      senderId: '2',
      receiverId: '1',
      content: 'I need to prepare my schedule',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false
    }
  ],
  '3': [
    {
      id: '3',
      senderId: '1',
      receiverId: '3',
      content: 'Have you completed your assignment?',
      timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      read: true
    },
    {
      id: '4',
      senderId: '3',
      receiverId: '1',
      content: 'Yes, I submitted my assignment',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: true
    }
  ],
  '4': [
    {
      id: '5',
      senderId: '4',
      receiverId: '1',
      content: 'Please review the new schedule',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false
    }
  ],
  '5': [
    {
      id: '6',
      senderId: '5',
      receiverId: '1',
      content: 'Can you provide feedback on my performance?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
      read: true
    },
    {
      id: '7',
      senderId: '1',
      receiverId: '5',
      content: 'Your performance has been excellent. Keep up the good work!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
      read: true
    },
    {
      id: '8',
      senderId: '5',
      receiverId: '1',
      content: 'Thank you for the feedback',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      read: true
    }
  ]
});

// Computed properties
const unreadCount = computed(() => {
  return contacts.value.reduce((total, contact) => {
    return total + (contact.unread ? contact.unreadCount : 0);
  }, 0);
});

const hasUnreadMessages = computed(() => unreadCount.value > 0);

// DOM reference for message container
const messagesContainer = ref(null);

// Methods
const toggleChat = () => {
  chatDrawer.value = !chatDrawer.value;
  if (chatDrawer.value) {
    // If we're opening the chat drawer, close any open chat window
    chatOpen.value = false;
  }
};

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value;
};

const openChat = (contact) => {
  selectedContact.value = contact;
  messages.value = messageHistory.value[contact.id] || [];
  chatOpen.value = true;
  chatDrawer.value = false;
  
  // Mark messages as read
  if (contact.unread) {
    contact.unread = false;
    contact.unreadCount = 0;
    
    // Update read status in message history
    if (messageHistory.value[contact.id]) {
      messageHistory.value[contact.id].forEach(msg => {
        if (msg.senderId === contact.id) {
          msg.read = true;
        }
      });
    }
  }
  
  // Scroll to bottom of messages
  nextTick(() => {
    scrollToBottom();
  });
};

const closeChat = () => {
  chatOpen.value = false;
  selectedContact.value = null;
};

const minimizeChat = () => {
  if (selectedContact.value) {
    // Add to minimized chats if not already there
    if (!minimizedChats.value.find(chat => chat.id === selectedContact.value.id)) {
      minimizedChats.value.push({...selectedContact.value});
    }
    chatOpen.value = false;
  }
};

const maximizeChat = (chat) => {
  // Remove from minimized chats
  minimizedChats.value = minimizedChats.value.filter(c => c.id !== chat.id);
  
  // Find the contact and open chat
  const contact = contacts.value.find(c => c.id === chat.id);
  if (contact) {
    openChat(contact);
  }
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedContact.value) return;
  
  // Create new message
  const message = {
    id: Date.now().toString(),
    senderId: currentUser.value.id,
    receiverId: selectedContact.value.id,
    content: newMessage.value.trim(),
    timestamp: new Date(),
    read: true
  };
  
  // Add to message history
  if (!messageHistory.value[selectedContact.value.id]) {
    messageHistory.value[selectedContact.value.id] = [];
  }
  messageHistory.value[selectedContact.value.id].push(message);
  
  // Update messages in current chat
  messages.value.push(message);
  
  // Update contact's last message
  const contactIndex = contacts.value.findIndex(c => c.id === selectedContact.value.id);
  if (contactIndex !== -1) {
    contacts.value[contactIndex].lastMessage = newMessage.value.trim();
    contacts.value[contactIndex].timestamp = new Date();
    
    // Move this contact to the top of the list
    const contact = contacts.value.splice(contactIndex, 1)[0];
    contacts.value.unshift(contact);
  }
  
  // Clear input
  newMessage.value = '';
  
  // Scroll to bottom of messages
  nextTick(() => {
    scrollToBottom();
  });
  
  // In a real app, you would send this message to Supabase here
  // For example:
  // sendMessageToSupabase(message);
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffDays < 7) {
    // Within a week - show day name
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    // Older - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

const startNewChat = () => {
  if (!newChatUser.value) return;
  
  // Check if we already have a chat with this user
  const existingContact = contacts.value.find(c => c.id === newChatUser.value.id);
  
  if (existingContact) {
    // Open existing chat
    openChat(existingContact);
  } else {
    // Create new contact
    const newContact = {
      id: newChatUser.value.id,
      name: newChatUser.value.name,
      role: newChatUser.value.role,
      lastMessage: '',
      timestamp: new Date(),
      unread: false,
      unreadCount: 0,
      avatar: newChatUser.value.avatar
    };
    
    // Add to contacts
    contacts.value.unshift(newContact);
    
    // Open chat
    openChat(newContact);
  }
  
  // Close dialog
  showNewMessageDialog.value = false;
  newChatUser.value = null;
};

// Simulate receiving a message (for demo purposes)
const simulateIncomingMessage = () => {
  // Pick a random contact
  const randomIndex = Math.floor(Math.random() * contacts.value.length);
  const sender = contacts.value[randomIndex];
  
  // Create message
  const message = {
    id: Date.now().toString(),
    senderId: sender.id,
    receiverId: currentUser.value.id,
    content: `This is a test message from ${sender.name}`,
    timestamp: new Date(),
    read: false
  };
  
  // Add to message history
  if (!messageHistory.value[sender.id]) {
    messageHistory.value[sender.id] = [];
  }
  messageHistory.value[sender.id].push(message);
  
  // Update contact
  const contactIndex = contacts.value.findIndex(c => c.id === sender.id);
  if (contactIndex !== -1) {
    // Update last message
    contacts.value[contactIndex].lastMessage = message.content;
    contacts.value[contactIndex].timestamp = new Date();
    
    // Mark as unread
    contacts.value[contactIndex].unread = true;
    contacts.value[contactIndex].unreadCount += 1;
    
    // Move to top of list
    const contact = contacts.value.splice(contactIndex, 1)[0];
    contacts.value.unshift(contact);
    
    // If chat is open with this contact, add message and mark as read
    if (selectedContact.value && selectedContact.value.id === sender.id) {
      messages.value.push(message);
      contacts.value[0].unread = false;
      contacts.value[0].unreadCount = 0;
      message.read = true;
      
      // Scroll to bottom
      nextTick(() => {
        scrollToBottom();
      });
    }
  }
};

// In a real app, you would set up Supabase realtime subscription here
// For demo purposes, we'll simulate receiving messages periodically
let messageInterval;

// Logout function
const logout = async () => {
  try {
    // Clear any intervals
    if (messageInterval) {
      clearInterval(messageInterval);
    }
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }
    
    console.log("Logged out successfully");
    
    // Redirect to the root path after successful logout
    router.push("/");
  } catch (err) {
    console.error("Unexpected error during logout:", err);
  }
};

// Setup Supabase realtime for messages (mock implementation)
const setupRealtimeMessages = () => {
  // In a real app, you would subscribe to Supabase realtime here
  // For demo purposes, we'll simulate receiving messages every 30-60 seconds
  messageInterval = setInterval(() => {
    // 20% chance of receiving a message
    if (Math.random() < 0.2) {
      simulateIncomingMessage();
    }
  }, 30000 + Math.random() * 30000);
};



// Watch for changes to chat window
watch(chatOpen, (isOpen) => {
  if (isOpen && selectedContact.value) {
    // Scroll to bottom when chat opens
    nextTick(() => {
      scrollToBottom();
    });
  }
});

onMounted(async () => {
  // Check if the user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // If not logged in, redirect to the root path
    router.push("/");
  } else {
    console.log('User is logged in, session:', session);
    
    // Setup realtime messages
    setupRealtimeMessages();
    
    // Get user role
    const role = await getUserRole();
    console.log('Retrieved role:', role);
    userRole.value = role || '';
    
    // For testing purposes, uncomment one of these lines if needed
    // userRole.value = 'officer'; // For testing officer view
    // userRole.value = 'cadet';   // For testing cadet view
    
    console.log('Set userRole to:', userRole.value);
    console.log('isOfficer computed value:', isOfficer.value);
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      router.push('/');
    }
  });
});
</script>

<style scoped>
.max-width-800 {
  max-width: 800px;
  margin: 0 auto;
}

.feature-card {
  transition: transform 0.3s ease;
  border: 1px solid #e0e0e0;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Black and white theme overrides */
:deep(.v-card) {
  border-radius: 8px;
}

:deep(.v-list-item__prepend > .v-icon) {
  color: black;
}

/* Chat styles */
.chat-drawer {
  z-index: 1000;
}

.unread {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: 500;
}

.chat-window {
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 80vh;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
}

.messages-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.message-bubble {
  max-width: 80%;
  border-radius: 12px;
  margin-bottom: 8px;
  position: relative;
}

.message-bubble.sent {
  align-self: flex-end;
  background-color: #000;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble.received {
  align-self: flex-start;
  background-color: #f0f0f0;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 0.7rem;
  margin-top: 4px;
  text-align: right;
}

.message-bubble.sent .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.minimized-chats {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: row-reverse;
  z-index: 999;
}

.minimized-chat-bubble {
  margin-left: 10px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
}

.minimized-chat-bubble:hover {
  transform: translateY(-5px);
}
</style>