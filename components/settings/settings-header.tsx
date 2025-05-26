"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>

          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
