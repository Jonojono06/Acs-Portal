
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleProtectedLayoutProps {
  allowedRole: string;
  children: React.ReactNode;
}

export default function RoleProtectedLayout({ allowedRole, children }: RoleProtectedLayoutProps) {
  const { state } = useUser();
  const { user, loading } = state;
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for user data to load
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== allowedRole) {
      router.push("/not-found");
    }
  }, [user, loading, router, allowedRole]);

  if (loading || !user) return <div>Loading...</div>;
  if (user.role !== allowedRole) return null; // Prevent flash of content

  return <>{children}</>;
}