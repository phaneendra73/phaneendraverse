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
import { Github, Twitter, Linkedin } from "lucide-react";

const aiFacts = [
  "Artificial Intelligence (AI) is transforming industries from healthcare to finance.",
  "Machine learning, a subset of AI, enables systems to learn and improve from experience.",
  "AI-powered chatbots are providing 24/7 customer support worldwide.",
  "Deep learning, a branch of AI, uses neural networks to analyze complex data patterns.",
  "AI is playing a crucial role in autonomous vehicles and robotics.",
];

export function AppSidebar(props) {
  const [fact, setFact] = React.useState(aiFacts[0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFact(aiFacts[Math.floor(Math.random() * aiFacts.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary flex aspect-square w-8 h-8 items-center justify-center rounded-lg">
                  <Image src="/panda.svg" alt="Panda" width={32} height={32} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Phaneendra Verse</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main content with AI facts */}
      <SidebarContent className="flex items-center justify-center text-center px-4">
        <div className="animate-bounce text-4xl">🤖</div>
        <p className="mt-4 text-sm italic text-muted-foreground transition-opacity duration-700 ease-in-out">
          {fact}
        </p>
      </SidebarContent>

      {/* Footer with social links and copyright */}
      <SidebarFooter className="flex flex-col gap-4 py-4 border-t">
        <div className="flex space-x-4 justify-center">
          <Link href="https://www.linkedin.com/in/phaneendra73/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="https://github.com/phaneendra73" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="https://twitter.com/Phaneendra37/" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5" />
          </Link>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          © {new Date().getFullYear()} Phaneendra
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}