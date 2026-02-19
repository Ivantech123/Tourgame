import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "server/.env" });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\s+/g, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, "");

let supabaseClient = null;

const getSupabase = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!SUPABASE_URL.startsWith("https://")) {
    throw new Error("SUPABASE_URL must start with https://");
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
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { error } = await supabase.from("users").select("id").limit(1);
      must(error, "Supabase connection");
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        const cause =
          error && typeof error === "object" && "cause" in error ? `; cause: ${String(error.cause)}` : "";
        throw new Error(`Supabase connection failed after ${maxAttempts} attempts${cause}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
    }
  }
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

export const tournamentsRepo = {
  async register({ userId, tournamentCode, tournamentTitle }) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("tournament_registrations")
      .insert({
        user_id: userId,
        tournament_code: tournamentCode,
        tournament_title: tournamentTitle,
      })
      .select("id")
      .single();
    must(error, "Register tournament");
    return data.id;
  },

  async listByUser(userId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("tournament_registrations")
      .select("id, tournament_code, tournament_title, created_at")
      .eq("user_id", userId)
      .order("id", { ascending: false });
    must(error, "List tournament registrations");
    return data;
  },
};
