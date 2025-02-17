"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, GraduationCap, BookOpen, User, Logs } from "lucide-react";
import LogoutButton from "./LogoutButton";

export function MainNav() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Professeurs", href: "/professeurs", icon: GraduationCap },
    { name: "Matieres", href: "/matieres", icon: BookOpen },
    { name: "Logs", href: "/logs", icon: Logs },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className=" flex flex-col h-full justify-between">
      <div className="space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
              pathname === item.href ? "bg-accent" : "transparent"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
{/* Bouton de déconnexion */}
       
        <LogoutButton />
        </div>
    </nav>
  );
}