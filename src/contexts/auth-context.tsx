import { createContext, useState, useEffect, useRef, type ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "../api";
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
const ACCESS_TOKEN_KEY = "@gabinete:access_token";

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
  const isSyncingProfile = useRef(false);

  const navigate = useNavigate();

  const syncProfile = useCallback(async () => {
    if (isSyncingProfile.current) return;

    isSyncingProfile.current = true;
    try {
      const profile = await AuthApi.getUserProfile();
      setUser(profile);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    } catch (error: any) {
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem(USER_KEY);
      }
    } finally {
      isSyncingProfile.current = false;
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      syncProfile();
    }
  }, [syncProfile]);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await AuthApi.login(data);
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      await syncProfile();
      toast.success("Login realizado com sucesso!");
      navigate("/");
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
      try {
        const refreshResponse = await apiClient.post('/auth/refresh');
        if (refreshResponse.data?.accessToken) {
          localStorage.setItem(ACCESS_TOKEN_KEY, refreshResponse.data.accessToken);
          console.log("Google login token armazenado em localStorage");
        }
      } catch (err) {
        console.warn("Não foi possível armazenar token do Google login", err);
      }
      toast.success("Login com Google realizado com sucesso!");
      navigate("/");
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
      localStorage.removeItem(ACCESS_TOKEN_KEY);
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
