import React, { createContext, useContext, useEffect, useState } from 'react';
import isTokenValid from "../components/isTokenValid";
import { useNavigate } from 'react-router-dom';


interface User {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  birthDate: string;
  city: string;
  street: string;
  houseNumber: string;
  mySkills: string[];
  
}

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  updateUser: (user: User) => void;
  removeUser: () => void;

}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
 

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const DecodeIDToken = (idToken: string): [string, string] => {
    const decodedToken = JSON.parse(atob(idToken.split(".")[1]));
    return [decodedToken.sub, decodedToken.email];
  };

  useEffect(() => {
    const url = window.location.href;
    if (url.includes("id_token") && url.includes("access_token")) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const idToken = hashParams.get("id_token");
      const accessToken = hashParams.get("access_token");

      if (idToken && accessToken) {
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("accessToken", accessToken);
        window.location.hash = "/";
      }
    }

    const idToken = localStorage.getItem("idToken");
    if (idToken && isTokenValid(idToken)) {
      const [userId, email] = DecodeIDToken(idToken);
      fetch("https://esg7w0u40m.execute-api.us-east-1.amazonaws.com/Dev/User", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, email }),
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch(() => navigate("/ErrorPage"));
    } else {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const idToken = hashParams.get("id_token");
      const accessToken = hashParams.get("access_token");

      if (idToken && accessToken) {
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("accessToken", accessToken);
        const [userId, email] = DecodeIDToken(idToken);
        fetch("https://ozshfkh0yg.execute-api.us-east-1.amazonaws.com/dev/User", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, email }),
        })
          .then((res) => res.json())
          .then((data) => setUser(data.user))
          .catch(console.error);
      } else {
        console.error("Tokens not found in the URL hash.");
      }
    }
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const idToken = localStorage.getItem("idToken");
      if (idToken && isTokenValid(idToken)) {
        const [userId] = DecodeIDToken(idToken);
        try {
          const response = await fetch("https://esg7w0u40m.execute-api.us-east-1.amazonaws.com/Dev/Admin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: idToken,
            },
            body: JSON.stringify({ Username: userId }),
          });

          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } catch (err) {
          console.error("Error fetching admin status:", err);
        }
      }
    };

    checkAdminStatus();
  }, []);

  const removeUser = () => setUser(null);

  const updateUser = (updatedUser: User) => setUser(updatedUser);



  return (
    <UserContext.Provider
      value={{
        user,
        isAdmin,
        updateUser,
        removeUser,
        
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
