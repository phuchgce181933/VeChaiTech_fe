import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Tracking khi user đang load

  const login = (userData, token, roles) => {
    const expirationTime = Date.now() + 10 * 60 * 1000; //  10 phút

    const userWithRole = {
      ...userData,
      token, // ✅ GẮN TOKEN VÀO USER
      role: roles && roles.length > 0 ? roles[0] : null,
      roles,
    };

    localStorage.setItem("user", JSON.stringify(userWithRole));
    localStorage.setItem("expiration", expirationTime);

    setUser(userWithRole);
  };


  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const expiration = localStorage.getItem("expiration");

    if (storedUser && expiration) {
      const parsedUser = JSON.parse(storedUser);

      if (Date.now() < parseInt(expiration, 10)) {
        setUser(parsedUser);

        console.log(parsedUser.token); // ✅ LOG SAU KHI CÓ USER

        const timeout = setTimeout(() => {
          logout();
        }, parseInt(expiration, 10) - Date.now());

        setIsLoading(false);
        return () => clearTimeout(timeout);
      } else {
        logout();
      }
    }

    setIsLoading(false);
  }, []);


  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Khai báo propTypes cho children
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
