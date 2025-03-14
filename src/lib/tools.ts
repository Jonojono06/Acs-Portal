import { databases } from "@/lib/appwrite";

export const updateTool = async (
  toolId: string,
  data: {
    name: string;
    serialNumber: string;
    toolVersion: string;
    localIpAddress?: string | null;
    tailScaleIpAddress?: string | null;
    status: "Active" | "In-Active";
  }
) => {
  return await databases.updateDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
    process.env.NEXT_PUBLIC_APPWRITE_TOOLS_COLLECTION_ID || "",
    toolId,
    data
  );
};