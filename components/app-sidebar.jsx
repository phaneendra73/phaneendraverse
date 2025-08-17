"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { BookOpen, Bot, Code2, Brain, Github, Twitter, Instagram, Linkedin } from "lucide-react";

// ⬇️ shadcn/ui Select
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const data = {
  navMain: [
    {
      title: "Coding Models",
      url: "#",
      icon: Code2,
      items: [
        { title: "Qwen Coder 32B", id: "qwen/qwen-2.5-coder-32b-instruct:free" },
        { title: "Qwen3 Coder", id: "qwen/qwen3-coder:free" },
        { title: "DeepCoder 14B", id: "agentica-org/deepcoder-14b-preview:free" },
      ],
    },
    {
      title: "Reasoning Models",
      url: "#",
      icon: Brain,
      items: [
        { title: "DeepSeek R1", id: "deepseek/deepseek-r1:free" },
        { title: "R1 Chimera", id: "tngtech/deepseek-r1t-chimera:free" },
        { title: "R1 Distill Llama 70B", id: "deepseek/deepseek-r1-distill-llama-70b:free" },
      ],
    },
    {
      title: "General Models",
      url: "#",
      icon: Bot,
      items: [
         { title: "GPT oss 20B", id: "openai/gpt-oss-20b:free" },
        { title: "Llama 3.3 70B", id: "meta-llama/llama-3.3-70b-instruct:free" },
        { title: "Llama 3.2 3B", id: "meta-llama/llama-3.2-3b-instruct:free" },
        { title: "Gemma 3 27B", id: "google/gemma-3-27b-it:free" },
        { title: "Mistral Small 24B", id: "mistralai/mistral-small-3.1-24b-instruct:free" },
      ],
    },
    {
      title: "Documentation",
      url: "https://openrouter.ai/models?max_price=0",
      icon: BookOpen,
      items: [
        { title: "Get Started", url: "https://openrouter.ai/models?max_price=0" },
        { title: "Docs", url: "https://openrouter.ai/docs/quickstart" },
      ],
    },
  ],
};

const MODEL_KEY = "pv:model";
const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

export function AppSidebar({ onModelSelect, ...props }) {
  const [model, setModel] = React.useState(DEFAULT_MODEL);

  // hydrate from localStorage once
  React.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(MODEL_KEY) : null;
    if (saved) {
      setModel(saved);
      onModelSelect?.(saved);
    } else {
      onModelSelect?.(DEFAULT_MODEL);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (val) => {
    setModel(val);
    if (typeof window !== "undefined") localStorage.setItem(MODEL_KEY, val);
    onModelSelect?.(val);
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary flex aspect-square w-8 h-8 items-center justify-center rounded-lg">
                  <Image src="/panda.svg" alt="Panda" width={32} height={32} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Panda verse</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* ⬇️ Model dropdown (doesn't touch your NavMain expand behavior) */}
        <div className="px-3 pt-3">
          <label className="text-xs text-muted-foreground mb-1 block">Active Model</label>
          <Select value={model} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {data.navMain
                .filter((g) => Array.isArray(g.items) && g.items.some((x) => x.id))
                .map((group) => (
                  <SelectGroup key={group.title}>
                    <SelectLabel>{group.title}</SelectLabel>
                    {group.items
                      .filter((x) => x.id)
                      .map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.title}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                ))}
            </SelectContent>
          </Select>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="flex flex-col items-center gap-3 py-4 border-t">
        <div className="flex space-x-4">
          <Link href="https://www.linkedin.com/in/phaneendra73/" target="_blank">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="https://github.com/phaneendra73" target="_blank">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="https://twitter.com/Phaneendra37/" target="_blank">
            <Twitter className="h-5 w-5" />
          </Link>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Phaneendra
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
