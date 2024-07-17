/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useCallback, useState, useEffect, ReactNode, FormEvent, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { connect } from "nats.ws";
import moment from "moment";

const apiUrl = 'http://localhost:5005';
const servers = [{ 
  servers: "ws://localhost:3222",
}];

interface LoginData { email: string; password: string }

interface AuthContextProviderProps { children: ReactNode }

interface User {
  _id: string;
  name: string;
  email: string;
}

type UserResponse = {
  _id: string;
  name: string;
  email: string;
  token: string;
};

type Decoded = {
  _id: string;
  exp: string;
  iat: string;
};

interface AuthContextProps {
  user: User | null;
  storeUser: (registerInfo: UserResponse) => void;
  login: (e: FormEvent<HTMLFormElement>, loginInfo: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token : Decoded = jwtDecode(localStorage.getItem("token") as string);
      if (moment(new Date(parseFloat(token.exp) * 1000)).isBefore(moment())) {
        logout();
      }
      const userId = token?._id;
      if (userId) {
        try {
          const response: AxiosResponse<User> = await axios.get(`${apiUrl}/users/get/${userId}`);
          setUser(response.data);
        } catch (error) {
          console.error("🚀 ~ fetchUser:", error)
          logout();
        }
      }
    };
    fetchUser();
  }, []);

  const storeUser = useCallback(
    async (user: UserResponse) => {
      try {
        localStorage.setItem("token", user.token);
        setUser(user);
      } catch (error) {
        setUser(null);
        console.error(error);
      }
    },
    []
  );

  const login = useCallback(
    async (e: FormEvent<HTMLFormElement>, loginInfo: LoginData) => {
      e.preventDefault();
      try {
        const response: AxiosResponse<UserResponse> = await axios.post(`${apiUrl}/users/login`, loginInfo);
        const token = response.data.token;

        localStorage.setItem("token", token);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, storeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const nats = async () => {
  try {
      const nc = await connect(servers[0]);
      return (nc);
  } catch (err) {
      console.error("error connecting to", err);
    }

};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export { AuthContextProvider, useAuth, apiUrl, nats };
