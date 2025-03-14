"use client";
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { account, databases } from "@/lib/appwrite";
import { Models } from "appwrite";
import { logout as authLogout } from "@/lib/auth";

interface User extends Models.Document {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  role: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  instagram?: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type UserAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: UserState = {
  user: null,
  loading: true,
  error: null,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  updateUser: (data: Partial<User>) => Promise<void>;
  logoutState: () => Promise<void>; 
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);


  const fetchUser = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const currentUser = await account.get();
      const response = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "",
        currentUser.$id
      );
      dispatch({ type: "SET_USER", payload: response as User });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to fetch user data." });
      dispatch({ type: "SET_USER", payload: null });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = async (data: Partial<User>) => {
    if (!state.user) return;
    try {
      const updatedUser = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "",
        state.user.$id,
        data
      );
      dispatch({ type: "SET_USER", payload: updatedUser as User });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to update user data." });
    }
  };

  const logoutState = async () => {
    try {
      await authLogout(); // Delete the Appwrite session
      dispatch({ type: "SET_USER", payload: null }); // Clear the user state
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to log out." });
    }
  };

  return (
    <UserContext.Provider value={{ state, dispatch, updateUser, fetchUser, logoutState }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};