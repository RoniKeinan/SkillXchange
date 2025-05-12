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
  image: string;
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
      // 👇 הוספת משתמש פיקטיבי במקרה שאין טוקן
      const fakeUser: User = {
        firstName: "Itai",
        lastName: "Glipoliti",
        phone: "0501234567",
        email: "itai@example.com",
        password: "fakepassword",
        birthDate: "1999-01-01",
        city: "Netanya",
        street: "Herzl",
        houseNumber: "5",
        mySkills: ["React", "Node.js", "AWS"],
        image: "https://i.pravatar.cc/150?img=3"
      };
      setUser(fakeUser);
      setIsAdmin(false); // אם אתה רוצה לבדוק גם הרשאות ניהול אפשר לשנות ל־true
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
