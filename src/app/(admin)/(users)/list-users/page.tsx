"use client"
import ComponentCard from "@/components/common/ComponentCard";
import UserTable from "@/components/tables/UserTable";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function BasicTables() {

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
    <div>
      {/* <PageBreadcrumb pageTitle="User List" /> */}
      <div className="space-y-6">
        <ComponentCard title="User List">
          <UserTable />
        </ComponentCard>
      </div>
    </div>
  );
}
