import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Resend from "next-auth/providers/resend"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import {db} from "@/drizzle/db"
import { users } from "@/drizzle/schema/nextAuthTables"
import { eq } from "drizzle-orm"
import { z } from "zod"
import bcrypt from "bcryptjs";



async function getAuthUser(email: string) {
    // "use cache"
    // cacheTag(getUserIdTag(id))
    //console.log("Called")
  
    return db.query.users.findFirst({
      where: eq(users.email, email),
    })
  }


 
export const { handlers, signIn, signOut, auth } = NextAuth({
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


