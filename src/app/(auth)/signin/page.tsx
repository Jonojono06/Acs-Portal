"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        router.push("/"); // Redirect to dashboard if already logged in
      }
    };
    checkAuth();
  }, [router]);

  return <SignInForm />;
}