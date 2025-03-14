"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ViewContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<string>("/");

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) throw new Error("useView must be used within a ViewProvider");
  return context;
};