import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-debug"

console.log("[ROUTE] NextAuth route handler initializing")

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }