import { createContext, useState, useEffect, type ReactNode } from "react";
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
  handleGoogleLogin: (token: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  updateLocalUser: (data: Partial<GetUserProfileResponse>) => void;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const TOKEN_KEY = "@gabinete:token";
const REFRESH_TOKEN_KEY = "@gabinete:refreshToken";
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
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<GetUserProfileResponse | null>(() => getStoredAuth().user);
  const [token, setToken] = useState<string | null>(
    () => getStoredAuth().token,
  );

  const navigate = useNavigate();

  useEffect(() => {
    async function syncProfile() {
      if (token) {
        try {
          const profile = await AuthApi.getUserProfile();
          setUser(profile);
          localStorage.setItem(USER_KEY, JSON.stringify(profile));
        } catch {
          // If token is invalid or request fails, we might want to logout
        }
      }
    }
    syncProfile();
  }, [token]);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await AuthApi.login(data);
      const { accessToken, refreshToken } = response;

      setToken(accessToken);
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      const userProfile = await AuthApi.getUserProfile();
      setUser(userProfile);
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));

      toast.success("Login realizado com sucesso!");

      navigate("/home");
    } catch (error) {
      toast.error("Erro ao realizar login. Verifique suas credenciais.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (accessToken: string, refreshToken: string) => {
    setIsLoading(true);
    try {
      setToken(accessToken);
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      const userProfile = await AuthApi.getUserProfile();
      setUser(userProfile);
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));

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

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
    navigate("/login");
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
        isAuthenticated: !!token,
        signUp,
        login,
        handleGoogleLogin,
        logout,
        updateLocalUser,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
