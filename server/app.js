import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import { bookingsRepo, initDb, usersRepo } from "./db.js";

dotenv.config({ path: "server/.env" });
dotenv.config();

export const app = express();
export const dbReady = initDb();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use(async (_req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (error) {
    console.error("DB init failed", error);
    res.status(500).json({ error: "database initialization failed" });
  }
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Backend API is running",
    health: "/api/health",
  });
});

const toClientUser = (row) => ({
  id: String(row.id),
  nickname: row.nickname,
  email: row.email,
  balance: row.balance,
  avatar: row.avatar,
  bio: row.bio ?? "",
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { nickname, email, password } = req.body ?? {};
    if (!nickname || !email || !password) {
      res.status(400).json({ error: "nickname, email and password are required" });
      return;
    }
    if (String(password).length < 6) {
      res.status(400).json({ error: "password must be at least 6 characters" });
      return;
    }

    const existing = await usersRepo.findByEmail(email);
    if (existing) {
      res.status(409).json({ error: "user already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await usersRepo.create({ nickname, email, passwordHash });
    const user = await usersRepo.findPublicById(userId);
    res.status(201).json({ user: toClientUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const user = await usersRepo.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: "invalid email or password" });
      return;
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      res.status(401).json({ error: "invalid email or password" });
      return;
    }

    res.json({ user: toClientUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "invalid user id" });
      return;
    }

    const updated = await usersRepo.updateProfile(id, req.body ?? {});
    if (!updated) {
      res.status(404).json({ error: "user not found" });
      return;
    }
    res.json({ user: toClientUser(updated) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { userId, trainerId, trainerName, game, character, durationMinutes, level, timeSlot } = req.body ?? {};
    if (!userId || !trainerId || !trainerName || !game || !character || !durationMinutes || !level || !timeSlot) {
      res.status(400).json({ error: "missing required booking fields" });
      return;
    }

    const user = await usersRepo.findPublicById(Number(userId));
    if (!user) {
      res.status(404).json({ error: "user not found" });
      return;
    }

    const bookingId = await bookingsRepo.create({
      userId: Number(userId),
      trainerId: Number(trainerId),
      trainerName: String(trainerName),
      game: String(game),
      character: String(character),
      durationMinutes: Number(durationMinutes),
      level: Number(level),
      timeSlot: String(timeSlot),
    });

    res.status(201).json({ bookingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
});

app.get("/api/bookings/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId)) {
      res.status(400).json({ error: "invalid user id" });
      return;
    }
    const items = await bookingsRepo.listByUser(userId);
    res.json({ bookings: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
});
