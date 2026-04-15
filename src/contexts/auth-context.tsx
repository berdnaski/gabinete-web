import { createContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AuthApi,
  type GetUserProfileResponse,
  type LoginRequest,
  type RegisterRequest
} from "../api/auth";

interface AuthContextType {
  user: GetUserProfileResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  logout: () => void;
  updateLocalUser: (data: Partial<GetUserProfileResponse>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const USER_KEY = "@gabinete:user";

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredAuth() {
  const storedUser = localStorage.getItem(USER_KEY);

  if (storedUser) {
    try {
      return {
        user: JSON.parse(storedUser),
      };
    } catch {
      return { user: null };
    }
  }

  return {
    user: null,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<GetUserProfileResponse | null>(() => getStoredAuth().user);

  const navigate = useNavigate();

  const syncProfile = useCallback(async () => {
    try {
      const profile = await AuthApi.getUserProfile();
      setUser(profile);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    } catch (error: any) {
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem(USER_KEY)) {
      syncProfile();
    }
  }, [syncProfile]);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await AuthApi.login(data);
      await syncProfile();
      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      toast.error("Erro ao realizar login. Verifique suas credenciais.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await syncProfile();
      toast.success("Login com Google realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      toast.error("Erro ao concluir o login com Google.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      await AuthApi.register(data);
      navigate("/");
    } catch (error) {
      toast.error("Erro ao realizar cadastro. Verifique suas credenciais.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthApi.logout();
    } catch (error) {
      console.error("Erro ao realizar logout no servidor", error);
    } finally {
      localStorage.removeItem(USER_KEY);
      setUser(null);
      navigate("/login");
    }
  };

  const updateLocalUser = (data: Partial<GetUserProfileResponse>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        login,
        handleGoogleLogin,
        logout,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
