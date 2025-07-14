import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: "Ov23li4TtKu7i2rEEGsB",
      clientSecret: "520a28f544373adee3cabec3b3142c11370b63a9"
    })
  ]
}