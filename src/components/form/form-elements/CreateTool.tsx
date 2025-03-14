"use client";
import React, { useState, FormEvent, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { ChevronDownIcon } from "../../../icons";
import { databases, ID } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import Alert from "@/components/ui/alert/Alert";

export default function CreateTool() {
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [toolVersion, setToolVersion] = useState("");
  const [localIpAddress, setLocalIpAddress] = useState("");
  const [tailScaleIpAddress, setTailScaleIpAddress] = useState("");
  const [companies, setCompanies] = useState(""); // Assuming company ID as string
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "In-Active", label: "In-Active" },
  ];

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false); // Reset success state

    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
        process.env.NEXT_PUBLIC_APPWRITE_TOOLS_COLLECTION_ID || "",
        ID.unique(),
        {
          companies, // Assuming this is a company ID
          name,
          serialNumber,
          toolVersion,
          localIpAddress,
          tailScaleIpAddress,
          status,
        }
      );
      setSuccess(true)
      setName("");
      setSerialNumber("");
      setToolVersion("");
      setLocalIpAddress("");
      setTailScaleIpAddress("");
      setCompanies("");
      setStatus("");
    } catch (err: any) {
      setError(err.message || "Failed to create tool.");
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
      <ComponentCard title="Create Tool" className="w-full max-w-md">
      {success && (
            <Alert
              variant="success"
              title="Creating Tool Success"
              message="Tool has been successfully created."
            />
          )}
          {error && (
            <Alert
              variant="error"
              title="Creating Tool Failed"
              message={error}
            />
          )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Tool Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tool name"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Serial Number</Label>
            <Input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Serial number"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Tool Version</Label>
            <Input
              type="text"
              value={toolVersion}
              onChange={(e) => setToolVersion(e.target.value)}
              placeholder="Tool version"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Local IP Address</Label>
            <Input
              type="text"
              value={localIpAddress}
              onChange={(e) => setLocalIpAddress(e.target.value)}
              placeholder="192.168.1.1"
              disabled={loading}
            />
          </div>
          <div>
            <Label>TailScale IP Address</Label>
            <Input
              type="text"
              value={tailScaleIpAddress}
              onChange={(e) => setTailScaleIpAddress(e.target.value)}
              placeholder="100.64.0.1"
              disabled={loading}
            />
          </div>
          <div>
            <Label>Status</Label>
            <div className="relative">
              <Select
                options={statusOptions}
                placeholder="Select status"
                onChange={handleStatusChange}
                className="dark:bg-dark-900"
                disabled={loading}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
          {/* <div>
            <Label>Company ID</Label>
            <Input
              type="text"
              value={companies}
              onChange={(e) => setCompanies(e.target.value)}
              placeholder="Enter company ID"
              required
              disabled={loading}
            />
          </div> */}
          {error && <p className="text-sm text-error-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-orange-500 shadow-theme-xs hover:bg-orange-600 disabled:bg-orange-300"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Tool"}
          </button>
        </form>
      </ComponentCard>
    </div>
  );
}