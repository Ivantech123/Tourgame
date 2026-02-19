import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "server/.env" });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseClient = null;

const getSupabase = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseClient;
};

const must = (error, context) => {
  if (error) {
    throw new Error(`${context}: ${error.message}`);
  }
};

export const initDb = async () => {
  const supabase = getSupabase();
  const { error } = await supabase.from("users").select("id").limit(1);
  must(error, "Supabase connection");
};

export const usersRepo = {
  async create({ nickname, email, passwordHash }) {
    const supabase = getSupabase();
    const normalizedEmail = email.toLowerCase();
    const { data, error } = await supabase
      .from("users")
      .insert({
        nickname,
        email: normalizedEmail,
        password_hash: passwordHash,
      })
      .select("id")
      .single();
    must(error, "Create user");
    return data.id;
  },

  async findByEmail(email) {
    const supabase = getSupabase();
    const normalizedEmail = email.toLowerCase();
    const { data, error } = await supabase
      .from("users")
      .select("id, nickname, email, password_hash, balance, avatar, bio")
      .eq("email", normalizedEmail)
      .maybeSingle();
    must(error, "Find user by email");
    return data;
  },

  async findPublicById(id) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("users")
      .select("id, nickname, email, balance, avatar, bio")
      .eq("id", id)
      .maybeSingle();
    must(error, "Find user by id");
    return data;
  },

  async updateProfile(id, fields) {
    const supabase = getSupabase();
    const updates = {};

    if (typeof fields.nickname === "string") {
      updates.nickname = fields.nickname;
    }
    if (typeof fields.bio === "string") {
      updates.bio = fields.bio;
    }
    if (typeof fields.avatar === "string") {
      updates.avatar = fields.avatar;
    }

    if (Object.keys(updates).length === 0) {
      return this.findPublicById(id);
    }

    const { error } = await supabase.from("users").update(updates).eq("id", id);
    must(error, "Update user profile");
    return this.findPublicById(id);
  },
};

export const bookingsRepo = {
  async create({
    userId,
    trainerId,
    trainerName,
    game,
    character,
    durationMinutes,
    level,
    timeSlot,
  }) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        trainer_id: trainerId,
        trainer_name: trainerName,
        game,
        character_name: character,
        duration_minutes: durationMinutes,
        level,
        time_slot: timeSlot,
      })
      .select("id")
      .single();
    must(error, "Create booking");
    return data.id;
  },

  async listByUser(userId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .select("id, trainer_id, trainer_name, game, character_name, duration_minutes, level, time_slot, created_at")
      .eq("user_id", userId)
      .order("id", { ascending: false });
    must(error, "List bookings by user");
    return data;
  },
};
