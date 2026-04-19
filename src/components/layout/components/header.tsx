import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationPopover } from "./notification-popover";
import { UserDropdown } from "@/components/user-dropdown";

export function Header() {
  return (
    <header className="flex p-1 border-b border-muted items-center justify-between">
      <div className="flex items-center gap-1 min-w-0 shrink-0">
        <SidebarTrigger className="hover:text-primary transition-all duraion-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-full" />
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <NotificationPopover />
        <UserDropdown />
      </div>
    </header>
  );
}