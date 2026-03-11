import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

interface AppLayoutProps {
    children: React.ReactNode
    title?: string
    description?: string
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
    return (
        <TooltipProvider>
            <SidebarProvider className="bg-zinc-100">
                <AppSidebar />
                <SidebarInset className="bg-white border-l border-zinc-200/50 shadow-sm ml-0 md:ml-0 overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <SidebarTrigger className="-ml-1 text-zinc-500 hover:text-zinc-900" />
                        <div className="h-4 w-px bg-zinc-200 mx-2" />
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold text-zinc-900 leading-tight">{title ?? "Gabinete"}</h2>
                            {description && <p className="text-xs text-zinc-400 leading-tight">{description}</p>}
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-6 md:p-10 bg-zinc-50/20 items-center">
                        <div className="mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
