import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !/^\S+@\S+\.\S+$/.test(String(email || "")) || !message) {
      return NextResponse.json({ error: "Name, valid email and message are required." }, { status: 400 });
    }
    await db.insert(contactMessages).values({
      name: String(name).slice(0, 160),
      email: String(email).slice(0, 255),
      subject: subject ? String(subject).slice(0, 255) : null,
      message: String(message).slice(0, 5000),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact failed", e);
    return NextResponse.json({ error: "Could not send message." }, { status: 500 });
  }
}
