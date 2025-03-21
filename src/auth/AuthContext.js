import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setUser({ token: storedToken, role: storedRole });
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);
    }
  }, [user]); // Atualiza localStorage sempre que o user mudar

  const login = (token, role) => {
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
