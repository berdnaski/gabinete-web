import { createContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi, type AuthResponse, type RegisterRequest, type SignInRequest } from "../api/auth";
import type { User } from "../types/auth-types";
import { toast } from "sonner";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signUp: (data: RegisterRequest) => Promise<void>;
    signIn: (data: SignInRequest) => Promise<void>;
    logout: () => void;
    token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "@gabinete:token";
const USER_KEY = "@gabinete:user";

interface AuthProviderProps {
    children: ReactNode;
}

function getStoredAuth() {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
        try {
            return {
                token: storedToken,
                user: JSON.parse(storedUser),
            };
        } catch {
            return { user: null, token: null };
        }
    }

    return {
        user: null,
        token: null,
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(() => getStoredAuth().user)
    const [token, setToken] = useState<string | null>(() => getStoredAuth().token)

    const navigate = useNavigate();

    const signIn = async (data: SignInRequest) => {
        setIsLoading(true)
        try {
            const response = await AuthApi.signIn(data)
            const {
                access_token, ...userData
            }: AuthResponse = response

            setToken(access_token)
            setUser(userData as User)
            localStorage.setItem(TOKEN_KEY, access_token)
            localStorage.setItem(USER_KEY, JSON.stringify(userData))

            toast.success("SignIn realizado com sucesso!")

            await new Promise(resolve => setTimeout(resolve, 3000))

            navigate("/home")
        } catch (error) {
            toast.error("Erro ao realizar login. Verifique suas credenciais.")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const signUp = async (data: RegisterRequest) => {
        setIsLoading(true);
        try {
            const response = await AuthApi.register(data);
            navigate("/");
        } catch (error) {
            toast.error("Erro ao realizar cadastro. Verifique suas credenciais.")
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        setToken(null);
        navigate("/signin");
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!token,
                signUp,
                signIn,
                logout,
                token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}