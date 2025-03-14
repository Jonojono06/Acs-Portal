import { Client, Account, Databases, ID, Avatars } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ""); // Fallback to empty string if not set

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export { ID };

export default client;