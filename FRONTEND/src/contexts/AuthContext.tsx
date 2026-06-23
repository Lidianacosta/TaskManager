import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  authApi,
  usersApi,
  getToken,
  saveToken,
  removeToken,
  ApiError,
  type User,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    setToken(storedToken);
    usersApi
      .me()
      .then((me) => {
        setUser(me);
      })
      .catch(() => {
        removeToken();
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token } = await authApi.login(email, password);
    saveToken(access_token);
    setToken(access_token);
    const me = await usersApi.me();
    setUser(me);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await usersApi.register({ name, email, password });

      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    removeToken();
    setToken(null);
    setUser(null);

    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiError };
