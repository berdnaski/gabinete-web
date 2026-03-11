import { Link } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
  }[]
}) {
  const { state } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-4 text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-4">
        Navegação
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1 group-data-[collapsible=icon]:gap-4">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={item.isActive}
              tooltip={item.title}
              className={`
                h-12 text-md rounded-md transition-colors duration-150
                group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center
                hover:bg-[#008EFF]/10 hover:text-[#008EFF]
                data-[active=true]:bg-transparent
                ${item.isActive
                  ? "bg-[#008EFF]/10 text-[#008EFF] font-bold"
                  : "text-zinc-500"
                }
              `}
            >
              <Link to={item.url} className="flex items-center gap-4 w-full group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
                <span className={`shrink-0 [&>svg]:size-6 ${item.isActive ? "text-[#008EFF]" : ""}`}>
                  {item.icon}
                </span>
                {isExpanded && <span className={`truncate ${item.isActive ? "text-[#008EFF]" : ""}`}>{item.title}</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
