import NextAuth from "next-auth"
import type { DefaultSession, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
    }
  }

  interface User {
    role: Role
  }
}

export const config = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
          role: token.role as Role,
        },
      }
    },
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
  },
}

const handler = NextAuth(config)
export { handler as GET, handler as POST }

export const auth = () => getServerSession(config) 