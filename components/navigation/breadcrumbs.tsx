"use client"

import { ModeToggle } from "@/components/global/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { TOPICS } from "@/lib/visualizer-topics"
import { CommandPalette } from "@/components/global/command-palette"

const routes: Record<string, { name: string; path: string }> = {
  "/": { name: "Home", path: "/home" },
  "/visualizer": { name: "Visualizer", path: "/visualizer" },
  ...Object.fromEntries(
    TOPICS.map((t) => [t.href, { name: t.name, path: t.href }])
  ),
}

export function Breadcrumbs({ 
  action 
}: { 
  action?: React.ReactNode 
}) {
  const pathname = usePathname()
  
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const items = []
    let currentPath = ""
    
    // Always add home
    items.push(
      <BreadcrumbItem key="home">
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
    )

    // Add intermediate segments
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const route = routes[currentPath as keyof typeof routes]
      
      if (route) {
        items.push(<BreadcrumbSeparator key={`separator-${index}`} />)
        
        if (index === segments.length - 1) {
          // Last segment - show as current page
          items.push(
            <BreadcrumbItem key={currentPath}>
              <BreadcrumbPage>{route.name}</BreadcrumbPage>
            </BreadcrumbItem>
          )
        } else {
          // Intermediate segment - show as link
          items.push(
            <BreadcrumbItem key={currentPath}>
              <BreadcrumbLink href={route.path}>{route.name}</BreadcrumbLink>
            </BreadcrumbItem>
          )
        }
      }
    })

    return items
  }

  return (
    <header className="sticky top-0 z-50 flex h-20 shrink-0 items-center gap-2 border-b bg-background shadow-sm supports-[backdrop-filter]:bg-background/95">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {getBreadcrumbs()}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-4">
          <CommandPalette />
          {action}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
} 
