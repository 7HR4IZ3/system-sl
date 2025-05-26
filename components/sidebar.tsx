"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Calendar,
  Trophy,
  Users,
  BarChart,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Goals",
    icon: Target,
    href: "/goals",
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    href: "/tasks",
  },
  {
    title: "Habits",
    icon: Calendar,
    href: "/habits",
  },
  {
    title: "Achievements",
    icon: Trophy,
    href: "/achievements",
  },
  {
    title: "Social",
    icon: Users,
    href: "/social",
  },
  {
    title: "Analytics",
    icon: BarChart,
    href: "/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed left-4 top-4 z-40"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <MobileSidebar pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      <aside className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-30 border-r">
        <DesktopSidebar pathname={pathname} />
      </aside>
      <div className="md:pl-64">
        {/* This div creates space for the fixed sidebar */}
      </div>
    </>
  );
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Trophy className="h-6 w-6 text-primary" />
          <span>LevelUp</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 p-4">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Level 7</span>
            <span>720/1000 XP</span>
          </div>
          <Progress value={72} className="h-2" />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <nav className="grid gap-1 py-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-1">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium">14-day streak</p>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileSidebar({
  pathname,
  setOpen,
}: {
  pathname: string;
  setOpen: (open: boolean) => void;
}) {
  return (
    <>
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
          onClick={() => setOpen(false)}
        >
          <Trophy className="h-6 w-6 text-primary" />
          <span>LevelUp</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 p-4">
        <div className="space-y-1 w-full">
          <div className="flex justify-between text-sm">
            <span>Level 7</span>
            <span>720/1000 XP</span>
          </div>
          <Progress value={72} className="h-2" />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <nav className="grid gap-1 py-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setOpen(false)}
            >
              <link.icon className="h-4 w-4" />
              {link.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-1">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium">14-day streak</p>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </div>
        </div>
      </div>
    </>
  );
}
