"use client";

import React from "react";
import { ChevronRight, Menu, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/global/mode-toggle";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { roadmapTopics } from "@/lib/visualizer-topics";
import { CommandPalette } from "@/components/global/command-palette";
import { AccessibilityMenu } from "@/components/global/accessibility-menu";
import { UserButtonWithAdminLink as UserButton } from "@/components/global/user-button-with-admin-link";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/learning-paths",
    label: "Learning Paths",
  },
  {
    href: "/company-questions",
    label: "Company Questions",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/about",
    label: "About Us",
  },
];

// Ordered as a learning roadmap — the `order` field on each topic in
// lib/topics.ts IS the step number shown in the nav (01, 02, 03...).
// Descriptions rendered here use each topic's shortDescription (~35 chars)
// since this list renders in a narrow two-column nav dropdown with a
// 1-line clamp, so anything longer just truncates mid-word.
const featureList = roadmapTopics().map((t) => ({
  title: t.name,
  description: t.shortDescription,
  url: t.href,
}));

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(pathname || "/visualizer")}`;

  return (
    <header className="sticky top-5 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="nav-shell mx-auto w-full max-w-[1600px]">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold tracking-tight hero-gradient-text">
              AlgoMaitri
            </span>
            <span className="hidden md:block text-[11px] text-muted-foreground tracking-[0.18em] uppercase">
              Visual DSA Studio
            </span>
          </div>
        </Link>

        <div className="flex items-center lg:hidden gap-2">
          <ModeToggle />

          {isSignedIn ? (
            <UserButton />
          ) : (
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link href={signInHref}>Sign in</Link>
            </Button>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="nav-mobile-btn" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="flex flex-col justify-between rounded-tr-3xl rounded-br-3xl bg-card/95 backdrop-blur-xl border-secondary"
            >
              <div>
                <SheetHeader className="mb-6 ml-1">
                  <SheetTitle className="flex items-center gap-2">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="hero-gradient-text">AlgoMaitri</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="mb-4 flex items-center gap-2">
                  {isSignedIn ? (
                    <UserButton />
                  ) : (
                    <Button className="rounded-xl w-full" asChild>
                      <Link href={signInHref} onClick={() => setIsOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="mb-5 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    What you can learn
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Explore core data structures and algorithms with interactive
                    visuals.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {routeList.map(({ href, label }) => (
                    <Button
                      key={href}
                      onClick={() => setIsOpen(false)}
                      asChild
                      variant="secondary"
                      className="justify-start rounded-xl text-base"
                    >
                      <Link href={href}>{label}</Link>
                    </Button>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Learning Roadmap
                  </p>
                  <div className="flex flex-col">
                    {featureList.slice(0, 8).map(({ title, url }, i) => (
                      <Link
                        key={title}
                        href={url}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3 border-l-2 border-border/60 py-2 pl-3 text-sm transition hover:border-violet-500 hover:text-violet-500"
                      >
                        <span className="font-mono text-[10px] text-muted-foreground/60 group-hover:text-violet-500">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                <Separator className="mb-3" />
                <div className="text-xs text-muted-foreground">
                  Built for visual understanding and practice.
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <NavigationMenu className="hidden lg:flex mx-auto">
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="nav-menu-trigger">
                What You Can Learn
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[640px] p-4">
                  <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    The AlgoMaitri learning roadmap
                  </p>
                  <div className="grid grid-cols-2 gap-x-6">
                    {[featureList.slice(0, Math.ceil(featureList.length / 2)), featureList.slice(Math.ceil(featureList.length / 2))].map(
                      (column, colIdx) => (
                        <ul key={colIdx} className="relative flex flex-col">
                          <span className="absolute left-[15px] top-2 bottom-2 w-px bg-violet-500/25" aria-hidden />
                          {column.map(({ title, description, url }, i) => {
                            const step = colIdx * Math.ceil(featureList.length / 2) + i + 1
                            return (
                              <li key={title} className="relative">
                                <NavigationMenuLink asChild>
                                  <Link href={url} className="nav-roadmap-row group flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-violet-500/[0.06]">
                                    <span className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-violet-500/25 bg-background font-mono text-[11px] font-semibold text-violet-500 transition-colors group-hover:border-violet-500 group-hover:bg-violet-500 group-hover:text-white">
                                      {String(step).padStart(2, "0")}
                                    </span>
                                    <div className="min-w-0 pt-0.5">
                                      <p className="mb-0.5 text-sm font-semibold leading-none text-foreground">
                                        {title}
                                      </p>
                                      <p className="line-clamp-1 text-xs text-muted-foreground">
                                        {description}
                                      </p>
                                    </div>
                                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 self-center text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            )
                          })}
                        </ul>
                      )
                    )}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {routeList.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link href={href} className="nav-link-pill whitespace-nowrap">
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex items-center gap-3">
          <CommandPalette />
          <AccessibilityMenu />
          <ModeToggle />

          {isSignedIn ? (
            <UserButton />
          ) : (
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href={signInHref}>Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
