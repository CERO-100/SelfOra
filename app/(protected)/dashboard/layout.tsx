import { AppSidebar } from "@/app/(protected)/dashboard/_components/app-sidebar";

import { SiteHeader } from "@/app/(protected)/dashboard/_components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Self-ora : Dashboard",
  description: "Dashboard layout",
};

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
