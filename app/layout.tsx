import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Providers } from "./providers";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cookies } from 'next/headers'
import { getAuthenticatedUser } from "./api/auth/login/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Système de gestion des  professeurs",
  description: "Manage professors and matieres efficiently",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  const user=await getAuthenticatedUser();

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen">
            {/* Mobile menu */}
            {token &&
            <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden fixed left-4 top-4 z-40">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-2 px-6 py-4">
                    <GraduationCap className="h-6 w-6" />
                    <h1 className="font-semibold">Gestion d&apos;université</h1>
                  </div>
                  <Separator />
                  <div className="flex-1 px-2 py-4">
                    <MainNav />
                  </div>
                  <div className="px-6 py-4">
                    <Separator className="mb-4" />
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden md:flex w-64 flex-col border-r bg-background">
              <div className="flex items-center gap-2 px-6 py-4">
                <GraduationCap className="h-6 w-6" />
                <h1 className="font-semibold">Gestion d&apos;université</h1>
              </div>
              <Separator />
              <div className="flex-1 px-2 py-4">
                <MainNav  user={user}  />
              </div>
              <div className="px-6 py-4">
                <Separator className="mb-4" />
                <ThemeToggle />
              </div>
            </div></>
}
            {/* Main content */}
            <div className="flex-1">
              <main className="container mx-auto p-4 md:p-6 pt-16 md:pt-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}