"use client";

import { useState } from "react";
import { Paintbrush } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const themes = [
  {
    name: "Default",
    primaryColor: "hsl(262.1 83.3% 57.8%)",
    value: "violet",
  },
  {
    name: "Blue",
    primaryColor: "hsl(221.2 83.2% 53.3%)",
    value: "blue",
  },
  {
    name: "Green",
    primaryColor: "hsl(142.1 76.2% 36.3%)",
    value: "green",
  },
  {
    name: "Orange",
    primaryColor: "hsl(24.6 95% 53.1%)",
    value: "orange",
  },
  {
    name: "Red",
    primaryColor: "hsl(0 72.2% 50.6%)",
    value: "red",
  },
];

export function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  // In a real app, this would update CSS variables or a theme context
  const handleSelectTheme = (themeValue) => {
    // This is a simplified example - in a real app you would
    // update CSS variables or use a theming system
    console.log(`Selected theme: ${themeValue}`);

    // For demo purposes only - would be replaced with actual theme implementation
    document.documentElement.style.setProperty(
      "--primary",
      themes.find((t) => t.value === themeValue)?.primaryColor,
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Customize theme">
          <Paintbrush className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleSelectTheme(t.value)}
          >
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: t.primaryColor }}
            />
            <span>{t.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
