"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api, {
  setAuthToken,
  setOnUnauthorized,
  type ApiError,
} from "../../src/services/apiClient";

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: "admin_geral" | "admin_turma" | "usuario";
  ativo: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Helper: try a list of endpoints with multiple payload variants in order.
 * Returns the first successful response body or throws the last encountered error.
 */
async function tryLoginEndpoints(
  endpoints: string[],
  payloadVariants: Record<string, any>[],
): Promise<{ response: any; attempts: any[] }> {
  const attempts: any[] = [];
  let lastErr: any = null;

  // For each endpoint, try multiple payload shapes and content types:
  // 1) JSON (api.post - existing helper)
  // 2) application/x-www-form-urlencoded (URLSearchParams + request)
  // 3) multipart/form-data (FormData + request)
  for (const ep of endpoints) {
    for (const payload of payloadVariants) {
      // --- Attempt 1: JSON via api.post (keeps current behavior) ---
      try {
        const resJson = await api.post(ep, payload);
        attempts.push({
          endpoint: ep,
          url: String(ep),
          payload,
          contentType: "application/json",
          status: 200,
        });
        return { response: resJson, attempts };
      } catch (errJson: any) {
        lastErr = errJson;
        const status =
          errJson && (errJson.status ?? errJson.statusCode ?? null);
        const message =
          errJson && (errJson.body?.message || errJson.message)
            ? errJson.body?.message || errJson.message
            : String(errJson);
        attempts.push({
          endpoint: ep,
          url: String(ep),
          payload,
          contentType: "application/json",
          status,
          error: message,
        });
        // continue to next content-type attempt
      }

      // --- Attempt 2: application/x-www-form-urlencoded ---
      try {
        const urlSearch = new URLSearchParams();
        for (const [k, v] of Object.entries(payload || {})) {
          if (v === undefined || v === null) continue;
          // Arrays and objects should be stringified in a simple way
          if (Array.isArray(v)) {
            v.forEach((item) => urlSearch.append(k, String(item)));
          } else if (typeof v === "object") {
            urlSearch.append(k, JSON.stringify(v));
          } else {
            urlSearch.append(k, String(v));
          }
        }
        const resFormUrl = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: urlSearch.toString(),
        });
        if (resFormUrl.ok) {
          const responseData = await resFormUrl.json();
          attempts.push({
            endpoint: ep,
            url: String(ep),
            payload,
            contentType: "application/x-www-form-urlencoded",
            status: resFormUrl.status,
          });
          return { response: responseData, attempts };
        } else {
          throw new Error(`HTTP ${resFormUrl.status}`);
        }
      } catch (errUrl: any) {
        lastErr = errUrl;
        const status = errUrl && (errUrl.status ?? errUrl.statusCode ?? null);
        const message =
          errUrl && (errUrl.body?.message || errUrl.message)
            ? errUrl.body?.message || errUrl.message
            : String(errUrl);
        attempts.push({
          endpoint: ep,
          url: String(ep),
          payload,
          contentType: "application/x-www-form-urlencoded",
          status,
          error: message,
        });
        // continue to next content-type attempt
      }

      // --- Attempt 3: multipart/form-data ---
      try {
        // Only available in browser; in Node this will likely fail — caller is frontend so OK
        const fd = new FormData();
        for (const [k, v] of Object.entries(payload || {})) {
          if (v === undefined || v === null) continue;
          if (Array.isArray(v)) {
            v.forEach((item) => fd.append(k, String(item)));
          } else if (typeof v === "object" && !(v instanceof File)) {
            fd.append(k, JSON.stringify(v));
          } else {
            fd.append(k, v as any);
          }
        }
        const resFormData = await fetch(ep, {
          method: "POST",
          // Do not set Content-Type for FormData; browser will set boundary
          body: fd,
        });
        if (resFormData.ok) {
          const responseData = await resFormData.json();
          attempts.push({
            endpoint: ep,
            url: String(ep),
            payload,
            contentType: "multipart/form-data",
            status: resFormData.status,
          });
          return { response: responseData, attempts };
        } else {
          throw new Error(`HTTP ${resFormData.status}`);
        }
      } catch (errForm: any) {
        lastErr = errForm;
        const status =
          errForm && (errForm.status ?? errForm.statusCode ?? null);
        const message =
          errForm && (errForm.body?.message || errForm.message)
            ? errForm.body?.message || errForm.message
            : String(errForm);
        attempts.push({
          endpoint: ep,
          url: String(ep),
          payload,
          contentType: "multipart/form-data",
          status,
          error: message,
        });
        // continue to next payload variant
      }
    }
    // continue to next endpoint
  }

  // no success; surface attempts and last error for diagnostics
  throw Object.assign(new Error("Nenhum endpoint respondeu com sucesso"), {
    attempts,
    lastError: lastErr,
  });
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("admin_token");
      const savedUser = localStorage.getItem("admin_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser) as User);
        setAuthToken(savedToken);
      }
    } catch (err) {
      console.error("Erro ao recuperar usuário do localStorage:", err);
      try {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      } catch {
        /* ignore */
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      setToken(null);
      setAuthToken(null);
      try {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      } catch {
        /* ignore */
      }
    });
    return () => {
      setOnUnauthorized(null);
    };
  }, []);

  /**
   * login flow:
   * - build candidate endpoints (prefer configured base if present)
   * - try multiple payload variants per endpoint
   * - normalize different response shapes
   */
  const login = async (email: string, senha: string): Promise<boolean> => {
    setIsLoading(true);

    // candidate same-origin endpoints
    const localCandidates = ["/api/auth/login", "/auth/login"];

    // build absolute candidates if NEXT_PUBLIC_API_BASE provided
    const configuredBase = (process.env.NEXT_PUBLIC_API_BASE || "").trim();
    const absCandidates: string[] = [];
    if (configuredBase) {
      const normalizedBase = configuredBase.replace(/\/+$/u, "");
      for (const c of localCandidates) {
        absCandidates.push(
          `${normalizedBase}${c.startsWith("/") ? c : `/${c}`}`,
        );
      }
    }

    // prefer absolute configured endpoints first, then same-origin
    const endpointsToTry =
      absCandidates.length > 0
        ? [...absCandidates, ...localCandidates]
        : [...localCandidates];

    // payload variants to increase compatibility with different backends
    const payloadVariants: Record<string, any>[] = [
      { email, senha }, // Portuguese
      { email, password: senha }, // English
      { username: email, password: senha },
      { usuario: email, senha },
      { usuario: email, password: senha },
    ];

    try {
      const { response, attempts } = await tryLoginEndpoints(
        endpointsToTry,
        payloadVariants,
      );

      // Normalize different possible API response shapes
      let resolvedToken: string | undefined;
      let resolvedUser: User | undefined;

      // Several common patterns
      if (response && response.success && response.data) {
        resolvedToken = response.data.token;
        resolvedUser = response.data.usuario ?? response.data.user;
      } else if (
        response &&
        response.token &&
        (response.usuario || response.user)
      ) {
        resolvedToken = response.token;
        resolvedUser = response.usuario ?? response.user;
      } else if (typeof response === "string" && response.length > 20) {
        // some APIs might return just a token string (rare)
        resolvedToken = response;
      } else if (response && response.user && response.jwt) {
        // example alternative shape
        resolvedToken = response.jwt;
        resolvedUser = response.user;
      }

      if (!resolvedToken || !resolvedUser) {
        const err: any = new Error(
          "Resposta inválida do servidor: token ou usuário ausente",
        );
        err.attempts = attempts;
        throw err;
      }

      if (
        resolvedUser.tipo !== "admin_geral" &&
        resolvedUser.tipo !== "admin_turma"
      ) {
        throw new Error("Acesso negado. Apenas administradores podem acessar.");
      }

      // persist auth state
      setToken(resolvedToken);
      setUser(resolvedUser);
      setAuthToken(resolvedToken);

      try {
        localStorage.setItem("admin_token", resolvedToken);
        localStorage.setItem("admin_user", JSON.stringify(resolvedUser));
      } catch (storageErr) {
        console.warn(
          "Não foi possível salvar credenciais no localStorage:",
          storageErr,
        );
      }

      return true;
    } catch (err: any) {
      // Provide diagnostics to console for troubleshooting
      if (err && (err as ApiError).status !== undefined) {
        console.error("Erro na autenticação (ApiError):", {
          status: (err as ApiError).status,
          body: (err as ApiError).body,
          attempts: (err as any).attempts ?? null,
        });
      } else {
        console.error("Erro no login:", err, {
          attempts: (err as any).attempts ?? null,
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    try {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    } catch {
      // ignore storage errors
    }
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
