import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

const DB_DIR = process.env.VERCEL
  ? path.resolve("/tmp", "tourgame-data")
  : path.resolve(process.cwd(), "server", "data");
const DB_PATH = path.join(DB_DIR, "database.sqlite");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

const defaultAvatar =
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&h=200&auto=format&fit=crop";

export const initDb = async () => {
  await run("PRAGMA foreign_keys = ON");

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      avatar TEXT NOT NULL DEFAULT '${defaultAvatar}',
      bio TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      trainer_id INTEGER NOT NULL,
      trainer_name TEXT NOT NULL,
      game TEXT NOT NULL,
      character_name TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      level INTEGER NOT NULL,
      time_slot TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

export const usersRepo = {
  async create({ nickname, email, passwordHash }) {
    const result = await run(
      `
      INSERT INTO users (nickname, email, password_hash)
      VALUES (?, ?, ?)
      `,
      [nickname, email.toLowerCase(), passwordHash]
    );
    return result.lastID;
  },

  findByEmail(email) {
    return get(
      `
      SELECT id, nickname, email, password_hash, balance, avatar, bio
      FROM users
      WHERE email = ?
      `,
      [email.toLowerCase()]
    );
  },

  findPublicById(id) {
    return get(
      `
      SELECT id, nickname, email, balance, avatar, bio
      FROM users
      WHERE id = ?
      `,
      [id]
    );
  },

  async updateProfile(id, fields) {
    const updates = [];
    const params = [];

    if (typeof fields.nickname === "string") {
      updates.push("nickname = ?");
      params.push(fields.nickname);
    }
    if (typeof fields.bio === "string") {
      updates.push("bio = ?");
      params.push(fields.bio);
    }
    if (typeof fields.avatar === "string") {
      updates.push("avatar = ?");
      params.push(fields.avatar);
    }

    if (updates.length === 0) {
      return this.findPublicById(id);
    }

    params.push(id);
    await run(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);
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
    const result = await run(
      `
      INSERT INTO bookings (
        user_id, trainer_id, trainer_name, game, character_name, duration_minutes, level, time_slot
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [userId, trainerId, trainerName, game, character, durationMinutes, level, timeSlot]
    );
    return result.lastID;
  },

  listByUser(userId) {
    return all(
      `
      SELECT id, trainer_id, trainer_name, game, character_name, duration_minutes, level, time_slot, created_at
      FROM bookings
      WHERE user_id = ?
      ORDER BY id DESC
      `,
      [userId]
    );
  },
};
