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

  console.log('Logged in user:', user);
  return { data: signInData, error: null };
}

export async function logout() {
  return await supabase.auth.signOut();
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

  const { error } = await supabase.storage
    .from('announcements')
    .upload(filePath, file);

  if (error) {
    return { error };
  }

  const { data: publicData, error: publicError } = supabase.storage
    .from('announcements')
    .getPublicUrl(filePath);

  if (publicError) {
    return { error: publicError };
  }

  const publicUrl = publicData.publicUrl;

  return {
    data: {
      path: filePath,
      url: publicUrl,
    },
    error: null,
  };
}



