import { AppSidebar } from "@/app/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Header from "../_components/Header";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
          <Header />
          
      </SidebarInset>
    </SidebarProvider>
  );
}
