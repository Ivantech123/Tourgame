import type { User } from "./App";

type AuthPayload = {
  nickname?: string;
  email: string;
  password: string;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

const parseResponse = async (response: Response) => {
  const raw = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson && raw ? JSON.parse(raw) : null;
  return { raw, data };
};

const request = async <T>(url: string, options: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const { raw, data } = await parseResponse(response);
  if (!response.ok) {
    const fallback = raw ? raw.slice(0, 180) : `HTTP ${response.status}`;
    throw new Error(data?.error ?? fallback);
  }

  if (!data) {
    throw new Error("API returned non-JSON response");
  }

  return data as T;
};

export const apiRegister = (payload: Required<AuthPayload>) =>
  request<{ user: User }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiLogin = (payload: AuthPayload) =>
  request<{ user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiUpdateUser = (userId: string, fields: Partial<User>) =>
  request<{ user: User }>(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(fields),
  });

export const apiCreateBooking = (payload: {
  userId: string;
  trainerId: number;
  trainerName: string;
  game: string;
  character: string;
  durationMinutes: number;
  level: number;
  timeSlot: string;
}) =>
  request<{ bookingId: number }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

