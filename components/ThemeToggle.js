"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      className="w-full justify-center"
      onClick={() => setTheme(theme === "neon-green" ? "dark" : "neon-green")}
    >
      {theme === "neon-green" ? <Moon /> : <Sun />}

    </Button>
  );
}
