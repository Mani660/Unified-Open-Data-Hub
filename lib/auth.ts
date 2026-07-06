import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret"
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "mock-github-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "mock-github-client-secret"
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.passwordHash) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordMatch) return null;

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        const requestedRole = credentials.role as string;
        if (requestedRole && user.role.toLowerCase() !== requestedRole.toLowerCase()) {
          throw new Error("ROLE_MISMATCH");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.image,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/home`;
      }

      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}/home`;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "USER";
      }
      if (account && account.provider !== "credentials") {
        token.role = token.role ?? "USER";
        try {
          const dbUser = token.email
            ? await prisma.user.findUnique({ where: { email: token.email } })
            : null;
          if (dbUser) token.role = dbUser.role;
        } catch {
          token.role = "USER";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
};
