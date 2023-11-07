"use client";

import { createContext, useState, ReactNode } from "react";

export const App_data = createContext({});

export function Context(props: { children: ReactNode }) {
  const [appData, setAppData] = useState({
    user: null,
    usersList: [],
    unread: [],
  });

  return (
    <App_data.Provider value={{ appData, setAppData }}>
      {props.children}
    </App_data.Provider>
  );
}
