"use client";

import React from "react";
import { BrainCircuit, ChevronRight, Menu, Sparkles } from "lucide-react";
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
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

interface RouteProps {
  href: string;
  label: string;
}

interface FeatureProps {
  title: string;
  description: string;
  url: string;
}

const routeList: RouteProps[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/about",
    label: "About Us",
  },
];

const featureList: FeatureProps[] = [
  {
    title: "Sorting",
    description: "Learn sorting through interactive visualizations.",
    url: "/visualizer/sorting",
  },
  {
    title: "Stacks",
    description: "Understand stack operations with animated learning.",
    url: "/visualizer/stack",
  },
  {
    title: "Queues",
    description: "Visualize enqueue, dequeue, and queue behavior.",
    url: "/visualizer/queue",
  },
  {
    title: "Linked Lists",
    description: "Explore node-based structures step by step.",
    url: "/visualizer/linked-list",
  },
  {
    title: "Binary Search Trees",
    description: "See insertions, traversals, and structure clearly.",
    url: "/visualizer/binary-tree",
  },
  {
    title: "AVL Trees",
    description: "Learn balancing and rotations visually.",
    url: "/visualizer/avl-tree",
  },
  {
    title: "Heaps",
    description: "Understand heap operations and ordering.",
    url: "/visualizer/heap",
  },
  {
    title: "Infix to Postfix",
    description: "Convert expressions using stack logic.",
    url: "/visualizer/stack-applications",
  },
  {
    title: "Message Queue",
    description: "Simulate producer-consumer queue systems.",
    url: "/visualizer/queue-applications",
  },
  {
    title: "Polynomial Multiplication",
    description: "Visualize polynomial operations in action.",
    url: "/visualizer/polynomial",
  },
  {
    title: "Huffman Coding",
    description: "Encode and decode using tree-based compression.",
    url: "/visualizer/huffman",
  },
  {
    title: "Dijkstra's Algorithm",
    description: "Find shortest paths through graph visualization.",
    url: "/visualizer/dijkstra",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-5 z-50 w-[92%] md:w-[78%] lg:w-[76%] lg:max-w-screen-xl mx-auto">
      <div className="nav-shell">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="nav-brand-icon">
            <BrainCircuit className="h-5 w-5" />
          </div>
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
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="rounded-xl">
                Sign in
              </Button>
            </SignInButton>
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
                      <BrainCircuit className="h-5 w-5" />
                      <span className="hero-gradient-text">AlgoMaitri</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="mb-4 flex items-center gap-2">
                  {isSignedIn ? (
                    <UserButton />
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="rounded-xl w-full">Sign in</Button>
                    </SignInButton>
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
                    Learn Visually
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {featureList.slice(0, 8).map(({ title, url }) => (
                      <Link
                        key={title}
                        href={url}
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm hover:bg-muted transition"
                      >
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
                <ul className="grid w-[560px] gap-3 p-4 md:grid-cols-2">
                  {featureList.map(({ title, description, url }) => (
                    <li key={title}>
                      <NavigationMenuLink asChild>
                        <Link href={url} className="nav-feature-card">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="mb-1 font-semibold leading-none text-foreground">
                                {title}
                              </p>
                              <p className="line-clamp-2 text-sm text-muted-foreground">
                                {description}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground" />
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {routeList.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link href={href} className="nav-link-pill">
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex items-center gap-3">
          <ModeToggle />

          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button variant="outline" className="rounded-xl">
                Sign in
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
};