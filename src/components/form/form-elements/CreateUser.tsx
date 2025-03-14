"use client";
import React, { useState, FormEvent, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { CalenderIcon, ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons";
import { databases, ID } from "@/lib/appwrite"; // Import Appwrite utilities
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/auth";
import Alert from "@/components/ui/alert/Alert";

export default function CreateUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const options = [
    { value: "super-admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "operator", label: "Operator" },
    { value: "view-only", label: "View Only" },
  ];

  const handleSelectChange = (value: string) => {
    setRole(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const user = await createUser(email, password, name);
            await databases.createDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
              process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "",
              user.$id,
              { email, name, role: role, status: "Active" }
            )
            setSuccess(true);
            setName("");
            setEmail("");
            setPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
      if (success || error) {
        const timer = setTimeout(() => {
          setSuccess(false);
          setError(null);
        }, 3000); // Dismiss after 3s
        return () => clearTimeout(timer);
      }
    }, [success, error]);
  return (
    <div className="flex items-center justify-center">
      <ComponentCard title="Create User" className="w-full max-w-md">
          {success && (
            <Alert
              variant="success"
              title="Creating User Success"
              message="User has been successfully created."
            />
          )}
          {error && (
            <Alert
              variant="error"
              title="Creating User Failed"
              message={error}
            />
          )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="info@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Select Role</Label>
            <div className="relative">
              <Select
                options={options}
                placeholder="Select an option"
                onChange={handleSelectChange}
                className="dark:bg-dark-900"
                disabled={loading}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-error-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-orange-500 shadow-theme-xs hover:bg-orange-600 disabled:bg-orange-300"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </ComponentCard>
    </div>
  );
}