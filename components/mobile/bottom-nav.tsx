"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, CheckSquare, Activity, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Goals",
      href: "/goals",
      icon: Target,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Habits",
      href: "/habits",
      icon: Activity,
    },
    {
      name: "Social",
      href: "/social",
      icon: Users,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
