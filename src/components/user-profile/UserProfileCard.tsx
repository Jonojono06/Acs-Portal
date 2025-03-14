"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";


export default function UserProfileCard() {

  const { state, updateUser } = useUser();
  const { user, loading, error } = state;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    setFormData({
        name: user?.name || "",
        email: user?.email || "",
    })
  }, [user]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-error-500">{error}</div>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                 Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formData?.name}
              </p>
            </div>
            {/* <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.lastName}
              </p>
            </div> */}
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.bio || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}