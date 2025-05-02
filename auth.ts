import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Resend from "next-auth/providers/resend"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import {db} from "@/drizzle/db"
import { accounts, users } from "@/drizzle/schema/nextAuthTables"
import { eq } from "drizzle-orm"
import { z } from "zod"
import bcrypt from "bcryptjs";
import type { Provider } from "next-auth/providers"
import { getAuthUser} from "@/features/users/db/users"


import { JWT } from "next-auth/jwt"
declare module 'next-auth/jwt' {
  interface JWT {
      id: string | undefined;
      role: 'admin' | 'user' | undefined
  }
}


declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id?: string | undefined,
    role?: 'admin' | 'user' | undefined
  }
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string | undefined
      role: 'admin' | 'user' | undefined
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }
}

  const providers: Provider[] = [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getAuthUser(email);
            if (!user || !user.password) {return null};
            const passwordsMatch = await bcrypt.compare(password, user.password);
            //console.log(user)
            if (passwordsMatch) return user;
          }
   
          console.log('Invalid credentials');
          return null;
      },
    }),
    GitHub,
    Google
  ]

  export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== "credentials")

  export const { handlers, auth, signIn, signOut } = NextAuth({
    providers,
    adapter: DrizzleAdapter(db),
    pages: {
      signIn: "/sign-in",
    },
    session:{
      strategy: 'jwt'
    },
    callbacks: {
      async jwt({ token, user,}) {
        if (user) { // User is available during sign-in
          token.id = user.id
          token.role = user.role ? user.role : 'user'
        }
         
        //console.log('TOKEN', token)
        return token
        //{...token, id:user.id, role: user.role}
      },
      session({ session, token }) {
        
        //console.log('SESSION USER!!!!', session.user)
        // session.user.id = token.id
        // session.user.role = token.role
        return {...session, user:{
          ...session.user,
          id: token.id,
          role: token.role
        }}
      },
      // session({ session, user }) {
      //   session.user.id = user.id
      //   return session
      // }
    
      // authorized({auth, request: {nextUrl}}){
      //   console.log('AUTHORIZED!',auth)
      //   return !!auth?.user
      // }
      // authorized({ auth, request: { nextUrl } }) {
      //   return !!auth?.user
      //   // console.log('AUTH',auth)
      //   // const isLoggedIn = !!auth?.user;
      //   // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      //   // if (isOnDashboard) {
      //   //   if (isLoggedIn) return true;
      //   //   return false; // Redirect unauthenticated users to login page
      //   // } else if (isLoggedIn) {
      //   //   return Response.redirect(new URL('/dashboard', nextUrl));
      //   // }
      //   return false;
      // },
    },
  } )  

 

//Basic auth config setup 
/* export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub, Resend, Google,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getAuthUser(email);
            if (!user || !user.password) {return null};
            const passwordsMatch = await bcrypt.compare(password, user.password);

            if (passwordsMatch) return user;
          }
   
          console.log('Invalid credentials');
          return null;
      },
    }),
  ],
})
 */

