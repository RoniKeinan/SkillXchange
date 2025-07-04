import React, { createContext, useContext, useEffect, useState } from 'react';
import isTokenValid from "../components/isTokenValid";
import { useNavigate } from 'react-router-dom';


interface Skill {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  birthDate: string;
  city: string;
  street: string;
  houseNumber: string;
  image?: string;
  mySkills: [];
}

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  skills: Skill[];
  updateUser: (user: User) => void;
  removeUser: () => void;
  setSkills: (skills: Skill[]) => void;
  updateSkill: (updatedSkill: Skill) => void;
  deleteSkill: (skillId: number) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [skills, setSkills] = useState<Skill[]>([]);

  const DecodeIDToken = (idToken: string) => {
    const decodedPayload = JSON.parse(atob(idToken.split(".")[1]));
    return decodedPayload;
  };

  useEffect(() => {

    const url = window.location.href;

    // Step 1: If the URL contains tokens, extract and store them
    if (url.includes("id_token") && url.includes("access_token")) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const idToken = hashParams.get("id_token");
      const accessToken = hashParams.get("access_token");

      if (idToken && accessToken) {
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("accessToken", accessToken);

        // Clear the hash so it doesn't get processed again
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }

    // Step 2: Get tokens from localStorage
    const idToken = localStorage.getItem("idToken");
    const accessToken = localStorage.getItem("accessToken");


    // Step 3: If tokens are missing or invalid, logout
    if (!idToken || !accessToken || !isTokenValid(idToken)) {
      setUser(null);
      return;
    }

    const decodedToken = DecodeIDToken(idToken);
    const userId = decodedToken.sub;
    const email = decodedToken.email;

    // Check if user is in the "Admin" group
    if (decodedToken["cognito:groups"]?.includes("Admin")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    fetch("https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/User", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId, email }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUser(data.user) 
        navigate("/"); // 👈 מעבר לדף הבית 
      })
      .catch((error) => {
        console.error("API call failed:", error);
        navigate("/ErrorPage");
      });
  }, []);



  const removeUser = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "https://us-east-1dwfznry1h.auth.us-east-1.amazoncognito.com/logout?client_id=5qvgf43gd6c32ve6o5drt5c92d&logout_uri=http://localhost:5173/";

  };

  const updateUser = (updatedUser: User) => setUser(updatedUser);
  const updateSkill = (updatedSkill: Skill) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === updatedSkill.id ? updatedSkill : skill
      )
    );
  };
  const deleteSkill = (skillId: number) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAdmin,
        skills,
        updateUser,
        removeUser,
        setSkills,
        updateSkill,
        deleteSkill
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
