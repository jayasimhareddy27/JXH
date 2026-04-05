'use client';
import { SessionProvider } from "next-auth/react";
import ReduxProvider from "@lib/redux/provider";

export default function CombinedProvider({ children }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}