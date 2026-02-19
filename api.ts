import type { User } from "./App";

type AuthPayload = {
  nickname?: string;
  email: string;
  password: string;
};

const request = async <T>(url: string, options: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
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

