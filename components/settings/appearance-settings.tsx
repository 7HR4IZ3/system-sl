"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Check } from "lucide-react";

// Sample theme colors
const themeColors = [
  { name: "Default", value: "violet", color: "#8b5cf6" },
  { name: "Blue", value: "blue", color: "#3b82f6" },
  { name: "Green", value: "green", color: "#10b981" },
  { name: "Orange", value: "orange", color: "#f59e0b" },
  { name: "Red", value: "red", color: "#ef4444" },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState("violet");

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <Label>Theme Mode</Label>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-6 w-6" />
              <span>Light</span>
            </Button>

            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-6 w-6" />
              <span>Dark</span>
            </Button>

            <Button
              variant={theme === "system" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => setTheme("system")}
            >
              <Monitor className="h-6 w-6" />
              <span>System</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Accent Color</Label>
          <div className="grid grid-cols-5 gap-4">
            {themeColors.map((color) => (
              <Button
                key={color.value}
                variant="outline"
                className="flex flex-col items-center justify-center h-20 gap-2 relative"
                onClick={() => setSelectedColor(color.value)}
              >
                <div
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: color.color }}
                />
                <span className="text-xs">{color.name}</span>
                {selectedColor === color.value && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Font Size</Label>
          <RadioGroup defaultValue="medium" className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small">Small</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">Large</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
