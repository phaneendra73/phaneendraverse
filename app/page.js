"use client";

import { useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useTheme } from "next-themes";
import ModelSelector from "@/components/modelselector";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import { lightfair } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const DEFAULT_MODEL = "Pollination";

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello 👋 Welcome To Panda Verse" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  const { theme } = useTheme();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          message: userMessage.content,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "⚠️ No response" },
      ]);
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
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-2 px-4 bg-background border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Chat Section */}
        <div className="flex flex-1 flex-col p-12 pt-4 pb-1">
          <div className="flex-1 overflow-y-auto space-y-4 pb-24">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={
                    "relative max-w-3xl px-4 py-2 rounded-2xl text-sm shadow-sm whitespace-pre-wrap bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  }
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        if (!inline && match) {
                          return (
                            <div className="relative">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    String(children).replace(/\n$/, "")
                                  );
                                  setCopiedIndex(i);
                                  setTimeout(() => setCopiedIndex(null), 1500);
                                }}
                                className="absolute right-2 top-2 text-xs bg-zinc-700 text-white px-2 py-1 rounded hover:bg-zinc-600"
                              >
                                {copiedIndex === i ? "Copied!" : "Copy"}
                              </button>
                              <SyntaxHighlighter
                                style={theme === "dark" ? atomDark: lightfair}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          );
                        }
                        return (
                          <code className="bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100 px-1 py-0.5 rounded">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 animate-pulse">
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
            className="sticky bottom-0 w-full bg-background p-2 sm:p-4 border-t"
          >
            <div className="relative flex w-full max-w-2xl mx-auto">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto"; // reset
                  e.target.style.height = `${Math.min(
                    e.target.scrollHeight,
                    120
                  )}px`; // cap at ~5 lines
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message…"
                className="flex-1 resize-none overflow-hidden bg-muted/20 rounded-xl py-2 pr-12 pl-3 text-sm border focus:outline-none disabled:opacity-50"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 bottom-3 h-9 w-9 rounded-full"
                disabled={loading || !input.trim()}
              >
                {loading ? "…" : "➤"}
              </Button>
            </div>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-2">
            Note: No conversation context is preserved. Each message is sent
            fresh to the model.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
