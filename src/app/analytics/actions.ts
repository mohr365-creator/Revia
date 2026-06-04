"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  _prev: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const entered = formData.get("password") as string;
  const expected = process.env.ANALYTICS_PASSWORD;

  if (!expected) {
    return { error: "ANALYTICS_PASSWORD is not configured." };
  }
  if (entered !== expected) {
    return { error: "Incorrect password." };
  }

  cookies().set("analytics_auth", entered, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/analytics");
}

export async function logout(): Promise<void> {
  cookies().delete("analytics_auth");
  redirect("/analytics");
}
