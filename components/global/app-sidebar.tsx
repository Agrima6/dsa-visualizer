"use client"

import { Home, Database, MapPin } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/navigation/nav-main"
import { NavProjects } from "@/components/navigation/nav-projects"
import { NavUser } from "@/components/navigation/nav-user"
import { topicsByCategory } from "@/lib/visualizer-topics"

const navItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Data Structures",
    url: "/visualizer",
    icon: Database,
  },
  {
    title: "Learning Paths",
    url: "/learning-paths",
    icon: MapPin,
  },
]

export function AppSidebar() {
  const toProject = (t: ReturnType<typeof topicsByCategory>[number]) => ({
    name: t.name,
    url: t.href,
    icon: t.icon,
    description: t.description,
  })

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <h1 className="text-sm font-semibold">AlgoMaitri</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavProjects title="Concepts" projects={topicsByCategory("concepts").map(toProject)} />
        <NavProjects title="Data Structures" projects={topicsByCategory("dataStructures").map(toProject)} />
        <NavProjects title="Applications" projects={topicsByCategory("applications").map(toProject)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
