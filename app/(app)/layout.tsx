import { AppSidebar } from "@/components/global/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { AppContentTransition } from "@/components/global/app-content-transition";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Breadcrumbs />
        <main className="flex-1 p-3 sm:p-10">
          <AppContentTransition>{children}</AppContentTransition>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
