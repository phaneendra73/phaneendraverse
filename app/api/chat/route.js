// app/api/chat/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const DEFAULT_MODEL = "openai/gpt-4o-mini"; // fallback

export async function POST(req) {
  try {
    const { message, model } = await req.json();
console.log("Chat API request:", { message, model });
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: model || DEFAULT_MODEL,
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices?.[0]?.message?.content || "";
console.log("Chat API response:", reply);
    return NextResponse.json({ reply: reply });
  } catch (err) {
    console.error("Chat API error:", err?.response?.data || err.message);
    return NextResponse.json(
      { error: err?.response?.data?.error|| err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
