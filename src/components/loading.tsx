import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react"

interface LoadingProps {
  className?: string;
}

export function Loading({ className }: LoadingProps) {
  return <Loader2 className={cn("mr-2 h-4 w-4 animate-spin", className)} />
}