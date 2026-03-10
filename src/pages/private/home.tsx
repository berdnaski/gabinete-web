import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Home() {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold">Bem-vindo, {user?.name || 'usuário'}!</h1>
            <Button onClick={logout} variant="destructive">
                Sair / Logout
            </Button>
        </div>
    );
}
