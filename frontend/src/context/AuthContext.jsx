import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("cc_token");
    if (!token) { setReady(true); return; }
    api.get("/auth/me").then(({ data }) => setUser(data.user)).catch(() => localStorage.removeItem("cc_token")).finally(() => setReady(true));
  }, []);
  const login = (data) => { localStorage.setItem("cc_token", data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem("cc_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, ready, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
