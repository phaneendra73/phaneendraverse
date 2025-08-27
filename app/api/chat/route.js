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
    const { message, model, provider } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let reply = "";

    if (model === "Pollination") {
      const res = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message },
          ],
          temperature: 0.7,
          stream: false,
          private: false,
        }),
      });

      const data = await res.json();
      reply = data.choices?.[0]?.message?.content || "";
    } else {
      // default: OpenRouter API
      const completion = await openai.chat.completions.create({
        model: model || DEFAULT_MODEL,
        messages: [{ role: "user", content: message }],
      });
      reply = completion.choices?.[0]?.message?.content || "";
    }
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err?.response?.data || err.message);
    return NextResponse.json(
      { error: err?.response?.data?.error || err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
