"use client"

import { Binary, Home, Database, BrainCircuit, TreePine, List, SquareStack, SquareChevronLeft, Equal, MessageSquare, X, Hash, ArrowRightLeft, Gauge, Parentheses, Repeat, Scale } from "lucide-react"
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
]

const concepts = [
  {
    name: "Time Complexity",
    url: "/visualizer/time-complexity",
    icon: Gauge,
    description: "Learn Big-O by experimenting — live growth graphs, real code execution, and instant-feedback quizzes",
  },
  {
    name: "Functions",
    url: "/visualizer/functions",
    icon: Parentheses,
    description: "Learn functions by watching real call stacks push and pop, with closures, recursion, and instant-feedback quizzes",
  },
]

const dataStructures = [
  {
    name: "Stack",
    url: "/visualizer/stack",
    icon: SquareStack,
    description: "LIFO data structure with push and pop operations",
  },  
  {
    name: "Queue",
    url: "/visualizer/queue",
    icon: SquareChevronLeft,
    description: "Simple, Circular, Priority, and Deque — all four types",
  },
   {
    name: "Sorting",
    url: "/visualizer/sorting",
    icon: SquareChevronLeft,
    description: "Learn Sorting",
  }, 
  {
    name: "Linked List",
    url: "/visualizer/linked-list",
    icon: List,
    description: "Linear data structure with elements linked using pointers",
  },
  {
    name: "Binary Tree",
    url: "/visualizer/binary-tree",
    icon: Binary,
    description: "Binary Search Tree and Heap, side by side",
  },
  
  {
    name: "Heap",
    url: "/visualizer/heap",
    icon: Database,
    description: "Binary heap implementation with max/min heap variants",
  },
  {
    name: "Recursion",
    url: "/visualizer/recursion",
    icon: Repeat,
    description: "20 interview questions from base cases to backtracking, with a real call-stack visualization",
  },
  {
    name: "AVL Tree",
    url: "/visualizer/avl-tree",
    icon: Scale,
    description: "Self-balancing BST — live balance factors and LL/RR/LR/RL rotations",
  },
]

const applications = [
  {
    name: "Message Queue",
    url: "/visualizer/queue-applications",
    icon: MessageSquare,
    description: "Asynchronous message processing system with producers and consumers",
  },
  {
    name: "Infix to Postfix Conversion",
    url: "/visualizer/stack-applications",
    icon: Equal,
    description: "Convert infix expressions to postfix notation using a stack",
  },
  {
    name: "Polynomial Multiplication",
    url: "/visualizer/polynomial",
    icon: X,
    description: "Multiply two polynomials using linked lists",
  },
  {
    name: "Huffman Coding",
    url: "/visualizer/huffman",
    icon: Hash,
    description: "Huffman coding is a popular data compression technique that creates variable-length prefix codes based on the frequency of characters in the input text.",
  },
  {
    name: "Dijkstra's Algorithm",
    url: "/visualizer/dijkstra",
    icon: ArrowRightLeft,
    description: "Dijkstra's algorithm is a graph search algorithm that finds the shortest path between nodes in a graph.",
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <h1 className="text-sm font-semibold">AlgoMaitri</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavProjects
          title="Concepts"
          projects={concepts.map(c => ({
            name: c.name,
            url: c.url,
            icon: c.icon,
            description: c.description,
          }))}
        />
        <NavProjects
          title="Data Structures"
          projects={dataStructures.map(ds => ({
            name: ds.name,
            url: ds.url,
            icon: ds.icon,
            description: ds.description,
          }))}
        />
        <NavProjects
          title="Applications"
          projects={applications.map(app => ({
            name: app.name,
            url: app.url,
            icon: app.icon,
            description: app.description,
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
} 
