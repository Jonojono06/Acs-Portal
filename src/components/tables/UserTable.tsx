"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { databases } from "@/lib/appwrite";
import { Models } from "appwrite";

interface User extends Models.Document {
  $id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  projectName?: string;
  team?: string[];
  status?: string;
  budget?: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
          process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || ""
        );
        console.log(response);

        // Define role order
        const roleOrder = {
          "super-admin": 1,
          admin: 2,
          operator: 3,
          "view-only": 4,
        };

        // Sort users by role
        const sortedUsers = (response.documents as User[]).sort((a, b) => {
          const roleA = roleOrder[a.role] || 5; // Fallback to 5 for undefined roles
          const roleB = roleOrder[b.role] || 5;
          return roleA - roleB;
        });

        setUsers(sortedUsers);
      } catch (err: any) {
        setError(err.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-error-500">{error}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Company
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow key={user.$id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      {/* <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={"/images/user/user-default.jpg"} // Use avatar or fallback
                          alt={user.name}
                        />
                      </div> */}
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {user.team && user.team.length > 0 ? (
                        user.team.map((teamImage, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                          >
                            <Image
                              width={24}
                              height={24}
                              src={teamImage}
                              alt={`Team member ${index + 1}`}
                              className="w-full"
                            />
                          </div>
                        ))
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        user.status === "Active"
                          ? "success"
                          : user.status === "In-Active"
                          ? "warning"
                          : user.status === "Blocked"
                          ? "error"
                          : "error"
                      }
                    >
                      {user.status || "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}