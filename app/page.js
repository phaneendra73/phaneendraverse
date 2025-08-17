"use client";

import { useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MODEL_KEY = "pv:model";
const CHAT_KEY = "pv:chat";
const SUMMARY_KEY = "pv:summary";
const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello 👋 Welcome To Panda Verse" },
  ]);
  const [summary, setSummary] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const chatEndRef = useRef(null);

  // Restore from localStorage
  useEffect(() => {
    const savedModel = typeof window !== "undefined" ? localStorage.getItem(MODEL_KEY) : null;
    const savedChat = typeof window !== "undefined" ? localStorage.getItem(CHAT_KEY) : null;
    const savedSummary = typeof window !== "undefined" ? localStorage.getItem(SUMMARY_KEY) : null;

    if (savedModel) setSelectedModel(savedModel);
    if (savedChat) setMessages(JSON.parse(savedChat));
    if (savedSummary) setSummary(savedSummary);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
      localStorage.setItem(SUMMARY_KEY, summary);
    }
  }, [messages, summary]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Summarize if history too long
  const maybeSummarize = async (history) => {
    if (history.length < 20) return; // only after 20 messages

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel || DEFAULT_MODEL,
          message: `Summarize this conversation in under 200 words:\n\n${history
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n")}`,
        }),
      });
      const data = await res.json();
      const newSummary = data.reply || summary;

      // Keep only summary + last 5 messages
      setSummary(newSummary);
      setMessages([
        { role: "system", content: `Summary so far: ${newSummary}` },
        ...history.slice(-5),
      ]);
    } catch (err) {
      console.error("Summarization failed", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

try {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: selectedModel || DEFAULT_MODEL,
      message: userMessage.content,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    // API returned error with a message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: `⚠️ Error: ${data.error || "Unknown server error"}` },
    ]);
  } else {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply || "⚠️ No response from model." },
    ]);

    // Maybe summarize after response
    maybeSummarize([
      ...newHistory,
      { role: "assistant", content: data.reply },
    ]);
  }
} catch (err) {
  setMessages((prev) => [
    ...prev,
    { role: "assistant", content: `⚠️ Network error: ${err.message}` },
  ]);
} finally {
  setLoading(false);
}

  };

  return (
    <SidebarProvider>
      <AppSidebar onModelSelect={setSelectedModel} />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 px-4 bg-background border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">PandaVerse</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Chat Section */}
        <div className="flex flex-1 flex-col p-12 pt-2">
          <div className="flex-1 overflow-y-auto space-y-4 pb-24">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-3xl px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <div className="relative">
                            <SyntaxHighlighter
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                            <button
                              onClick={() => navigator.clipboard.writeText(String(children))}
                              className="absolute top-2 right-2 text-xs bg-background border px-2 py-1 rounded hover:bg-muted"
                            >
                              Copy
                            </button>
                          </div>
                        ) : (
                          <code className="bg-muted px-1 py-0.5 rounded">{children}</code>
                        );
                      },
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Thinking Pulse */}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-muted text-muted-foreground animate-pulse">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 sticky bottom-0 w-full bg-background p-4 border-t"
          >
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Type a message…  (model: ${selectedModel?.split(":")[0] || "default"})`}
              className="flex-1 resize-none bg-muted/20 rounded-lg p-2 text-sm border focus:outline-none"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "…" : "Ask"}
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
