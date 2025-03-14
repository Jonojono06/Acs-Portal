"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/CreateUser";
import { useUser } from "@/context/UserContext";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function FormElements() {
  const { state } = useUser();
  const { user, loading } = state;
  const router = useRouter();
  const role = user?.role || "view-only";

  useEffect(() => {
    if (!loading && !["super-admin", "admin"].includes(role)) {
      router.push("/");
    }
  }, [loading, role, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!["super-admin", "admin"].includes(role)) {
    return null; // Or render an access denied message
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <PageBreadcrumb pageTitle="Create User" />
        <DefaultInputs />
      </div>
    </div>
  );
}
