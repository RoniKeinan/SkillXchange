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
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  birthDate: string;
  city: string;
  street: string;
  houseNumber: string;
  image: string;
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
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [skills, setSkills] = useState<Skill[]>([]);

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
      // משתמש פיקטיבי
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
        image: "https://i.pravatar.cc/150?img=3",
      };
      setUser(fakeUser);
      setIsAdmin(false);

      setSkills([
        {
          id: 1,
          name: 'Web Development',
          category: 'Technology',
          description: 'Build modern websites and applications using HTML, CSS, JS.',
        },
        {
          id: 2,
          name: 'Node.js',
          category: 'Technology',
          description: 'Backend development using Node.js.',
        },
        {
          id: 3,
          name: 'AWS',
          category: 'Cloud',
          description: 'Deploy and manage apps on Amazon Web Services.',
        },
      ]);
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
