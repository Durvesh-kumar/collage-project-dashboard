import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_AUTH_ID!,
      clientSecret: process.env.FACEBOOK_AUTH_SECRET!,
      authorization: {
        prisma: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Google({
      clientId: process.env.GOOGLE_AUTH_ID!,
      clientSecret: process.env.GOOGLE_AUTH_SECRET!,
      // authorization: {
      //   url: "https://accounts.google.com/o/oauth2/v2/auth",
      //   prisma: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code",
      //   },
      // },
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials:any) {
        if (credentials === null) return null;
        try {
          if (
            !credentials.email.includes("@") ||
            !credentials.email.includes(".")
          ) {
            throw new Error("Invalid email");
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (user) {
            if (user?.isVerified === false) {
              throw new Error("User not Verified");
            }

            if (!user?.password) {
              throw new Error("Password is missing for the user");
            }
            const isMatch = await bcrypt.compare(credentials.password, user.password);

            if(isMatch) {
              return user
            } else {
              throw new Error("Check your password and email!")
            }

          } else if (!user) {
            throw new Error("User not found");
          }

          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({user, token}){

      const findUser = await prisma.user.findUnique({
        where: {
          id: token.sub ? token.sub : user.id
        }
      });

      if (!findUser) {
        throw new Error("User not found");
      }

      if(findUser){
        return{
          ...token,
          role: findUser.role,
          isVerified: findUser.isVerified,
          collectionId: findUser?.collectionId
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      
      if(token){
          return{
              ...session,
              role: token.role,
              collectionId: token?.collectionId,
              isVerified: token.isVerified
          }
      }
      console.log(session, "hey call me session");
      
      return session;
  }
  },
  secret: process.env.NEXTAUTH_SECRET,
});