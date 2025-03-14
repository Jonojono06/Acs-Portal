"use client";
import { account, ID } from "./appwrite";
import { Models } from "appwrite";

// Type for user session or account data
type User = Models.User<Models.Preferences>;

export async function login(email: string, password: string): Promise<User> {
  try {
    await account.createEmailPasswordSession(email, password);
    return await account.get();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function signup(email: string, password: string, name: string): Promise<User> {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}


export async function createUser(email: string, password: string, name: string): Promise<User> {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    // await account.createEmailPasswordSession(email, password);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}






export async function logout(): Promise<void> {
  await account.deleteSession("current");
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
}