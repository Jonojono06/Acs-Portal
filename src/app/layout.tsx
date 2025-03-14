import { Outfit } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { ViewProvider } from "@/context/ViewContext";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <title>ACS Portal</title>
          <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <UserProvider>
          <ViewProvider>
            <ThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </ViewProvider>
        </UserProvider>
      </body>
    </html>
  );
}