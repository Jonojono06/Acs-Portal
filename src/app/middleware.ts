// import { NextRequest, NextResponse } from "next/server";
// import { Client, Account } from "appwrite";

// const client = new Client()
//   .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
//   .setProject("67d1d7a8001490a39050"); // Your Project ID

// const account = new Account(client);

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Allow access to /signin and /signup without checking auth
//   if (pathname === "/signin" || pathname === "/signup") {
//     try {
//       // Check if user is already logged in
//       const cookies = request.cookies.getAll();
//       client.headers["X-Appwrite-Session"] = cookies
//         .map((cookie) => `${cookie.name}=${cookie.value}`)
//         .join("; ");
//       const user = await account.get();
//       if (user) {
//         return NextResponse.redirect(new URL("/", request.url)); // Redirect logged-in users to /
//       }
//     } catch (error) {
//       // No session, allow access to /signin or /signup
//       return NextResponse.next();
//     }
//     return NextResponse.next();
//   }

//   // Protect all other routes (e.g., /, /profile, etc.)
//   try {
//     // Pass cookies to Appwrite client to verify session
//     const cookies = request.cookies.getAll();
//     client.headers["X-Appwrite-Session"] = cookies
//       .map((cookie) => `${cookie.name}=${cookie.value}`)
//       .join("; ");
//     await account.get(); // Throws if no valid session
//     return NextResponse.next(); // User is authenticated, proceed
//   } catch (error) {
//     // No valid session, redirect to /signin
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Apply to all routes except static files
// };




import { NextRequest, NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const user = await account.get();
    const userDoc = await account.getSession("current");
    const userData = await fetch(
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/databases/${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}/collections/${process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID}/documents/${user.$id}`,
      {
        headers: {
          "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
          "X-Appwrite-Session": userDoc.$id,
        },
      }
    ).then((res) => res.json());

    const role = userData.role || "view-only";

    const protectedRoutes: { [key: string]: string[] } = {
      "/create-user": ["super-admin", "admin"],
      "/list-users": ["super-admin", "admin"],
      "/create-tool": ["super-admin"],
      "/list-tools": ["super-admin"],
      "/create-company": ["super-admin", "admin"],
      "/list-companies": ["super-admin", "admin"],
    };

    const allowedRoles = protectedRoutes[pathname];
    if (allowedRoles && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/create-user",
    "/list-users",
    "/create-tool",
    "/list-tools",
    "/create-company",
    "/list-companies",
  ],
};