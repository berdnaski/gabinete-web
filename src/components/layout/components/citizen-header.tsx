import { Button } from "@/components/ui/button"
import { UserDropdown } from "@/components/user-dropdown"
import { useAuth } from "@/hooks/use-auth"
import { LogIn } from "lucide-react"
import { Link } from "react-router-dom"
import GIcon from '@/assets/icon.svg'

export function CitizenHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="fixed bg-white top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 py-2 border-b border-muted shadow-sm">
      <Link to="/">
        <img src={GIcon} alt="Ícone do Gabinete" className="size-12" />
      </Link>

      {isAuthenticated ?
        <UserDropdown /> :
        <Link to="/login">
          <Button variant="default">
            Entrar
            <LogIn className="size-4" />
          </Button>
        </Link>
      }
    </header>
  )
}