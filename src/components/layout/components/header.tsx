import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePageTitle } from "@/hooks/use-page-title";

export function Header() {
  const {
    title: { title, description },
  } = usePageTitle();

  return (
    <header className="flex items-center justify-between border-b border-muted p-2">
      <SidebarTrigger />
      <div className="h-4 w-px bg-muted mx-2" />
      <div className="flex flex-col">
        <h2 className="text-sm font-bold leading-tight">
          {title ?? "Gabinete"}
        </h2>
        {description && (
          <p className="text-xs text-zinc-400 leading-tight">{description}</p>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
