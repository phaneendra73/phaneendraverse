"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

const navMain = [
  {
    title: "Coding Models",
    items: [
      { title: "Qwen Coder 32B", id: "qwen/qwen-2.5-coder-32b-instruct:free" },
      { title: "Qwen3 Coder", id: "qwen/qwen3-coder:free" },
      { title: "DeepCoder 14B", id: "agentica-org/deepcoder-14b-preview:free" },
    ],
  },
  {
    title: "Reasoning Models",
    items: [
      { title: "DeepSeek R1", id: "deepseek/deepseek-r1:free" },
      { title: "R1 Chimera", id: "tngtech/deepseek-r1t-chimera:free" },
      { title: "R1 Distill Llama 70B", id: "deepseek/deepseek-r1-distill-llama-70b:free" },
    ],
  },
  {
    title: "General Models",
    items: [
      { title: "GPT oss 20B", id: "openai/gpt-oss-20b:free" },
      { title: "Llama 3.3 70B", id: "meta-llama/llama-3.3-70b-instruct:free" },
      { title: "Llama 3.2 3B", id: "meta-llama/llama-3.2-3b-instruct:free" },
      { title: "Gemma 3 27B", id: "google/gemma-3-27b-it:free" },
      { title: "Mistral Small 24B", id: "mistralai/mistral-small-3.1-24b-instruct:free" },
    ],
  },
];

export default function ModelSelector({ selectedModel, setSelectedModel }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[220px] justify-between truncate"
        >
          {selectedModel || "Select AI"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>Providers</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setSelectedModel("Pollination")}>
          Pollination.AI
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>OpenRouter</DropdownMenuLabel>

        {navMain.map((group) => (
          <DropdownMenuSub key={group.title}>
            <DropdownMenuSubTrigger>{group.title}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-64">
              {group.items.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => setSelectedModel(item.id)}
                  className="max-w-[240px] whitespace-normal break-words text-sm"
                >
                  {item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
