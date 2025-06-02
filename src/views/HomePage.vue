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
                  <div class="text-h5 font-weight-bold">{{ totalUsers }}</div>
                  <div class="text-caption">Total Users</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- <v-col cols="12" md="3">
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
          </v-col> -->

          <v-col cols="12" md="3">
            <v-card class="mb-4" variant="outlined">
              <v-card-text class="d-flex align-center">
                <v-icon size="x-large" color="black" class="mr-4"
                  >mdi-clipboard-text</v-icon
                >
                <div>
                  <div class="text-h5 font-weight-bold">85%</div>
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

          <v-col cols="12" md="3">
            <v-card class="mb-4" variant="outlined">
              <v-card-text class="d-flex align-center">
                <v-icon size="x-large" color="black" class="mr-4">mdi-bullhorn</v-icon>
                <div>
                  <div class="text-h5 font-weight-bold">{{ announcementCount }}</div>
                  <div class="text-caption">Announcements</div>
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
          v-for="conversation in conversations"
          :key="conversation.id"
          @click="openChat(conversation)"
          :active="selectedConversation && selectedConversation.id === conversation.id"
          :class="{ 'unread': conversation.unread_count > 0 }"
        >
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1" class="mr-3">
              <span class="text-h6">{{ getInitials(conversation.other_user_name) }}</span>
            </v-avatar>
          </template>

          <v-list-item-title>{{ conversation.other_user_name || 'Unknown User' }}</v-list-item-title>
          <v-list-item-subtitle class="text-truncate">
            {{ conversation.last_message || 'No messages yet' }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <div class="d-flex flex-column align-end">
              <span class="text-caption text-grey">{{ formatTime(conversation.updated_at) }}</span>
              <v-badge
                v-if="conversation.unread_count > 0"
                color="red"
                :content="conversation.unread_count.toString()"
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
          <v-toolbar-title v-if="selectedConversation">
            {{ selectedConversation.other_user_name || 'Unknown User' }}
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
                v-for="message in messages"
                :key="message.id"
                :class="[
                  'message-bubble mb-2 pa-2',
                  message.sender_id === currentUser.id ? 'sent' : 'received'
                ]"
              >
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div class="message-time text-caption text-grey">
                  {{ formatTime(message.created_at) }}
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
          <v-btn color="black" icon @click="sendMessage" :disabled="!newMessage.trim()">
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
            item-title="display_name"
            item-value="id"
            label="Select a user"
            placeholder="Search for a user"
            return-object
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar color="grey-lighten-1" size="32">
                    <span class="text-caption">{{ getInitials(item.raw.display_name) }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.raw.display_name || 'Unknown User' }}</v-list-item-title>
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
          <span class="text-white">{{ getInitials(chat.other_user_name) }}</span>
        </v-avatar>
        <v-badge
          v-if="chat.unread_count > 0"
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
import { supabase, ensureUserProfile } from "./supabase";
import { useRouter } from "vue-router";
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue';
import AnnouncementSection from '../components/AnnouncementsSection.vue';
import AnnouncementManager from '../views/AnnouncementManager.vue';

const router = useRouter();

// User state
const userRole = ref('');
const currentUser = ref({
  id: null,
  name: '',
  role: '',
  display_name: ''
});

const isOfficer = computed(() => {
  return userRole.value.toLowerCase() === 'officer';
});

// Stats
const totalUsers = ref(0);
const announcementCount = ref(0);

// Chat state
const chatDrawer = ref(false);
const chatOpen = ref(false);
const selectedConversation = ref(null);
const conversations = ref([]);
const messages = ref([]);
const newMessage = ref('');
const minimizedChats = ref([]);
const showNewMessageDialog = ref(false);
const newChatUser = ref(null);
const availableUsers = ref([]);
const notificationsOpen = ref(false);

// Realtime subscription
let messagesSubscription = null;
let conversationsSubscription = null;

// Computed properties
const unreadCount = computed(() => {
  return conversations.value.reduce((total, conv) => {
    return total + (conv.unread_count || 0);
  }, 0);
});

const hasUnreadMessages = computed(() => unreadCount.value > 0);

// DOM reference
const messagesContainer = ref(null);

// Chat functions
async function fetchConversations() {
  if (!currentUser.value.id) return;

  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        user1_id,
        user2_id,
        last_message,
        updated_at,
        user1:profiles!conversations_user1_id_fkey(id, display_name, role),
        user2:profiles!conversations_user2_id_fkey(id, display_name, role)
      `)
      .or(`user1_id.eq.${currentUser.value.id},user2_id.eq.${currentUser.value.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    // Process conversations to get other user info and unread counts
    const processedConversations = await Promise.all(
      data.map(async (conv) => {
        const otherUser = conv.user1_id === currentUser.value.id ? conv.user2 : conv.user1;
        
        // Get unread count
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('receiver_id', currentUser.value.id)
          .eq('read', false);

        return {
          id: conv.id,
          other_user_id: otherUser?.id,
          other_user_name: otherUser?.display_name || 'Unknown User',
          other_user_role: otherUser?.role || 'user',
          last_message: conv.last_message,
          updated_at: conv.updated_at,
          unread_count: count || 0
        };
      })
    );

    conversations.value = processedConversations;
  } catch (err) {
    console.error('Exception fetching conversations:', err);
  }
}

async function fetchAvailableUsers() {
  if (!currentUser.value.id) return;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, role')
      .neq('id', currentUser.value.id)
      .order('display_name');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    // Filter out users without display names and add fallbacks
    const processedUsers = (data || []).map(user => ({
      ...user,
      display_name: user.display_name || 'Unknown User'
    }));

    availableUsers.value = processedUsers;
    totalUsers.value = processedUsers.length + 1; // +1 for current user
  } catch (err) {
    console.error('Exception fetching users:', err);
  }
}

async function fetchMessages(conversationId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    messages.value = data || [];

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', currentUser.value.id)
      .eq('read', false);

    // Update conversation unread count
    const convIndex = conversations.value.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      conversations.value[convIndex].unread_count = 0;
    }

    // Scroll to bottom
    nextTick(() => {
      scrollToBottom();
    });
  } catch (err) {
    console.error('Exception fetching messages:', err);
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedConversation.value) return;

  const messageContent = newMessage.value.trim();
  newMessage.value = '';

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation.value.id,
        sender_id: currentUser.value.id,
        receiver_id: selectedConversation.value.other_user_id,
        content: messageContent,
        read: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    // Optimistically add the sent message to the UI
    messages.value.push(data);

    // Update conversation last message
    await supabase
      .from('conversations')
      .update({
        last_message: messageContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedConversation.value.id);

    // Update local conversation
    const convIndex = conversations.value.findIndex(c => c.id === selectedConversation.value.id);
    if (convIndex !== -1) {
      conversations.value[convIndex].last_message = messageContent;
      conversations.value[convIndex].updated_at = new Date().toISOString();
      // Move to top
      const conv = conversations.value.splice(convIndex, 1)[0];
      conversations.value.unshift(conv);
    }

    nextTick(() => {
      scrollToBottom();
    });

  } catch (err) {
    console.error('Exception sending message:', err);
  }
}

async function startNewChat() {
  if (!newChatUser.value) return;

  try {
    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(user1_id.eq.${currentUser.value.id},user2_id.eq.${newChatUser.value.id}),and(user1_id.eq.${newChatUser.value.id},user2_id.eq.${currentUser.value.id})`)
      .single();

    let conversationId;

    if (existingConv) {
      conversationId = existingConv.id;
    } else {
      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          user1_id: currentUser.value.id,
          user2_id: newChatUser.value.id,
          last_message: null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return;
      }

      conversationId = newConv.id;
    }

    // Create conversation object
    const conversation = {
      id: conversationId,
      other_user_id: newChatUser.value.id,
      other_user_name: newChatUser.value.display_name || 'Unknown User',
      other_user_role: newChatUser.value.role,
      last_message: null,
      updated_at: new Date().toISOString(),
      unread_count: 0
    };

    // Add to conversations if not exists
    if (!conversations.value.find(c => c.id === conversationId)) {
      conversations.value.unshift(conversation);
    }

    // Open chat
    openChat(conversation);
    showNewMessageDialog.value = false;
    newChatUser.value = null;

  } catch (err) {
    console.error('Exception starting new chat:', err);
  }
}

function openChat(conversation) {
  selectedConversation.value = conversation;
  chatOpen.value = true;
  chatDrawer.value = false;
  fetchMessages(conversation.id);
}

function closeChat() {
  chatOpen.value = false;
  selectedConversation.value = null;
  messages.value = [];
}

function minimizeChat() {
  if (selectedConversation.value) {
    if (!minimizedChats.value.find(chat => chat.id === selectedConversation.value.id)) {
      minimizedChats.value.push({...selectedConversation.value});
    }
    chatOpen.value = false;
  }
}

function maximizeChat(chat) {
  minimizedChats.value = minimizedChats.value.filter(c => c.id !== chat.id);
  const conversation = conversations.value.find(c => c.id === chat.id);
  if (conversation) {
    openChat(conversation);
  }
}

function toggleChat() {
  chatDrawer.value = !chatDrawer.value;
  if (chatDrawer.value) {
    chatOpen.value = false;
  }
}

function toggleNotifications() {
  notificationsOpen.value = !notificationsOpen.value;
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

function getInitials(name) {
  if (!name || name === 'Unknown User') return 'U';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

async function getUserRole() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }
    
    // Get role from user metadata first
    const roleFromMetadata = session.user.user_metadata?.role;
    if (roleFromMetadata) {
      return roleFromMetadata;
    }
    
    // Fallback to profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user role from profiles:', error);
      return null;
    }
    
    return data?.role || null;
  } catch (err) {
    console.error('Exception fetching user role:', err);
    return null;
  }
}

async function setupRealtimeSubscriptions() {
  if (!currentUser.value.id) return;

  // Listen for messages where user is receiver OR sender
  messagesSubscription = supabase
    .channel('messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `or(receiver_id.eq.${currentUser.value.id},sender_id.eq.${currentUser.value.id})`
    }, (payload) => {
      const newMessage = payload.new;
      // Only add if it's for the current conversation
      if (selectedConversation.value && newMessage.conversation_id === selectedConversation.value.id) {
        messages.value.push(newMessage);
        nextTick(() => {
          scrollToBottom();
        });
      }
      // ...update conversations list as needed...
    })
    .subscribe();

  // Subscribe to conversation updates
  conversationsSubscription = supabase
    .channel('conversations')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'conversations'
    }, () => {
      fetchConversations();
    })
    .subscribe();

  // Real-time announcements count
  supabase
    .channel('announcements')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'announcements'
    }, () => {
      fetchAnnouncementCount();
    })
    .subscribe();

  supabase
    .channel('profiles')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'profiles'
    }, () => {
      fetchTotalUsers();
    })
    .subscribe();
}

async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }
    
    router.push("/");
  } catch (err) {
    console.error("Unexpected error during logout:", err);
  }
}

watch(chatOpen, (isOpen) => {
  if (isOpen && selectedConversation.value) {
    nextTick(() => {
      scrollToBottom();
    });
  }
});

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    router.push("/");
    return;
  }

  await ensureUserProfile(session.user);

  const displayName = session.user.user_metadata?.full_name || 
                     session.user.user_metadata?.name || 
                     session.user.email?.split('@')[0] || 
                     'User';

  currentUser.value = {
    id: session.user.id,
    name: session.user.email,
    role: session.user.user_metadata?.role || 'cadet',
    display_name: displayName
  };

  const role = await getUserRole();
  userRole.value = role || '';

  await Promise.all([
    fetchConversations(),
    fetchAvailableUsers(),
    fetchAnnouncementCount(),
    fetchTotalUsers() // <-- Add this
  ]);

  setupRealtimeSubscriptions();

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session) {
      router.push('/');
    } else {
      await ensureUserProfile(session.user);
    }
  });
});

onUnmounted(() => {
  if (messagesSubscription) {
    messagesSubscription.unsubscribe();
  }
  if (conversationsSubscription) {
    conversationsSubscription.unsubscribe();
  }
});

async function fetchAnnouncementCount() {
  const { count, error } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true });

  if (!error) {
    announcementCount.value = count || 0;
  } else {
    console.error('Error fetching announcement count:', error);
    announcementCount.value = 0;
  }
}

async function fetchTotalUsers() {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching total users:', error);
      totalUsers.value = 0;
      return;
    }

    totalUsers.value = count || 0;
  } catch (err) {
    console.error('Exception fetching total users:', err);
    totalUsers.value = 0;
  }
}
</script>

<style scoped>
.max-width-800 {
  max-width: 800px;
  margin: 0 auto;
}

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