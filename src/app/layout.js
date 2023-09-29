"use client";
import { ChakraProvider } from "@chakra-ui/react";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Elections - Krihsna Consciousness Society</title>
      </head>
      <body>
        <ChakraProvider
          toastOptions={{ defaultOptions: { position: "top-right" } }}
        >
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
