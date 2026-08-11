import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current logged-in user
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/get`,{
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check user when application loads
  useEffect(() => {
    getCurrentUser();
  }, []);

    

  const value = {
    user,
    setUser,
    getCurrentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
