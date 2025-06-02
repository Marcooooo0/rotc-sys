import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qpicrcsksvnhiwosiadf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaWNyY3Nrc3ZuaGl3b3NpYWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDM4OTQsImV4cCI6MjA2MzQ3OTg5NH0.lnwet6J5ptEfE2slnZx5dc8Kr4GDul1md0yF-BMcpHQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };

// ───────────────────────────────────────────────────────
// AUTH HELPERS
// ───────────────────────────────────────────────────────

export async function getUser() {
  const { data, error } = await supabase.auth.getSession();
  return error ? null : data.session;
}

export async function signUp(email, password, fullName, phoneNumber, role) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phoneNumber,
        role,
      },
    },
  });

  // If signup successful, create profile
  if (data?.user && !error) {
    await ensureUserProfile(data.user);
  }

  return { data, error };
}

export async function login(email, password, expectedRole) {
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error('Sign-in error:', signInError);
    return { error: signInError };
  }

  const user = signInData.user;
  const actualRole = user?.user_metadata?.role;

  if (!actualRole || actualRole !== expectedRole) {
    return { error: new Error("Incorrect role selected for this account.") };
  }

  // Ensure profile exists after successful login
  await ensureUserProfile(user);

  console.log('Logged in user:', user);
  return { data: signInData, error: null };
}

export async function logout() {
  return await supabase.auth.signOut();
}

// ───────────────────────────────────────────────────────
// PROFILE FUNCTIONS
// ───────────────────────────────────────────────────────

export async function ensureUserProfile(user) {
  if (!user) return;

  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const displayName = user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       user.email?.split('@')[0] || 
                       'User';
    
    const role = user.user_metadata?.role || 'cadet';

    if (!existingProfile) {
      // Create new profile
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          display_name: displayName,
          role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        console.log('Profile created for user:', displayName);
      }
    } else {
      // Update existing profile if display_name is missing or different
      if (!existingProfile.display_name || existingProfile.display_name !== displayName) {
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name: displayName,
            role: role,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile:', error);
        } else {
          console.log('Profile updated for user:', displayName);
        }
      }
    }
  } catch (err) {
    console.error('Exception in ensureUserProfile:', err);
  }
}

export async function createOrUpdateProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      display_name: profileData.display_name,
      role: profileData.role,
      updated_at: new Date().toISOString()
    })
    .select();

  return { data, error };
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, role')
    .order('display_name');

  return { data, error };
}

export async function getUserWithProfile(userId) {
  try {
    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: authError };
    }

    // Get profile from profiles table
    const { data: profile, error: profileError } = await getProfile(userId);
    
    if (profileError) {
      // If profile doesn't exist, create it
      await ensureUserProfile(user);
      const { data: newProfile } = await getProfile(userId);
      return { data: { user, profile: newProfile }, error: null };
    }

    return { data: { user, profile }, error: null };
  } catch (err) {
    console.error('Exception in getUserWithProfile:', err);
    return { data: null, error: err };
  }
}

// ───────────────────────────────────────────────────────
// CHAT FUNCTIONS
// ───────────────────────────────────────────────────────

export async function getConversations(userId) {
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
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  return { data, error };
}

export async function createConversation(user1Id, user2Id) {
  // Check if conversation already exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    .single();

  if (existing) {
    return { data: existing, error: null };
  }

  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user1_id: user1Id,
      user2_id: user2Id,
      last_message: null,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
}

export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  return { data, error };
}

export async function sendMessage(conversationId, senderId, receiverId, content) {
  // Insert the message
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      receiver_id: receiverId,
      content: content,
      read: false
    })
    .select()
    .single();

  if (messageError) {
    return { data: null, error: messageError };
  }

  // Update conversation last message and timestamp
  const { error: updateError } = await supabase
    .from('conversations')
    .update({
      last_message: content,
      updated_at: new Date().toISOString()
    })
    .eq('id', conversationId);

  if (updateError) {
    console.error('Error updating conversation:', updateError);
  }

  return { data: messageData, error: null };
}

export async function markMessagesAsRead(conversationId, userId) {
  const { data, error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .eq('receiver_id', userId)
    .eq('read', false);

  return { data, error };
}

export async function getUnreadMessageCount(userId) {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('read', false);

  return { count, error };
}

export async function getUnreadCountForConversation(conversationId, userId) {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .eq('receiver_id', userId)
    .eq('read', false);

  return { count, error };
}

// ───────────────────────────────────────────────────────
// REALTIME SUBSCRIPTIONS
// ───────────────────────────────────────────────────────

export function subscribeToMessages(userId, callback) {
  return supabase
    .channel('messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `receiver_id=eq.${userId}`
    }, callback)
    .subscribe();
}

export function subscribeToConversations(callback) {
  return supabase
    .channel('conversations')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'conversations'
    }, callback)
    .subscribe();
}

export function subscribeToUserStatus(callback) {
  return supabase
    .channel('profiles')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles'
    }, callback)
    .subscribe();
}

// ───────────────────────────────────────────────────────
// ANNOUNCEMENT FUNCTIONS
// ───────────────────────────────────────────────────────

export async function getAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function createAnnouncement(title, content, imageUrl = null) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData?.session) {
    return { error: new Error('User not authenticated') };
  }

  const userId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from('announcements')
    .insert([
      {
        title,
        content,
        image_url: imageUrl,
        created_by: userId,
      },
    ])
    .select();

  return { data, error };
}

export async function updateAnnouncement(id, updates) {
  const { data, error } = await supabase
    .from('announcements')
    .update(updates)
    .eq('id', id)
    .select();

  return { data, error };
}

export async function deleteAnnouncement(id) {
  const { data, error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  return { data, error };
}

// ───────────────────────────────────────────────────────
// STORAGE HELPERS
// ───────────────────────────────────────────────────────

export async function uploadAnnouncementImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `announcement-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('announcements')
    .upload(filePath, file);

  if (uploadError) {
    return { error: uploadError };
  }

  const { data: publicData, error: publicError } = await supabase.storage
    .from('announcements')
    .getPublicUrl(filePath);

  if (publicError) {
    return { error: publicError };
  }

  return {
    data: {
      path: filePath,
      url: publicData.publicUrl,
    },
    error: null,
  };
}

// ───────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ───────────────────────────────────────────────────────

export async function initializeUserProfile(user) {
  return await ensureUserProfile(user);
}

export function formatMessageTime(timestamp) {
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

export function getUserInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}