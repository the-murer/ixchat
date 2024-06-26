/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useCallback, useState, useEffect, ReactNode, FormEvent, useContext } from "react";
import axios, { AxiosResponse } from "axios";

const apiUrl = 'http://localhost:5005';
const socketUrl = 'http://localhost:5001';

interface LoginData { email: string; password: string }

interface AuthContextProviderProps { children: ReactNode }

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  registerUser: (e: FormEvent<HTMLFormElement>, registerInfo: User) => Promise<void>;
  login: (e: FormEvent<HTMLFormElement>, loginInfo: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response: AxiosResponse<User> = await axios.get(`${apiUrl}/users/get/${userId}`);
          setUser(response.data);
        } catch (error) {
          console.log("🚀 ~ fetchUser ~ error:", error)
          logout();
        }
      }
    };
    fetchUser();
  }, []);

  const registerUser = useCallback(
    async (e: FormEvent<HTMLFormElement>, registerInfo: any) => {
      e.preventDefault();
      try {
        const response: any = await axios.post(`${apiUrl}/users/register`, registerInfo);
        const userId = response.data._id;
        localStorage.setItem("userId", userId);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const login = useCallback(
    async (e: FormEvent<HTMLFormElement>, loginInfo: LoginData) => {
      e.preventDefault();
      try {
        const response: AxiosResponse<User> = await axios.post(`${apiUrl}/users/login`, loginInfo);
        const userId = response.data._id;

        localStorage.setItem("userId", userId);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("userId");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, registerUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export { AuthContextProvider, useAuth, apiUrl, socketUrl };
