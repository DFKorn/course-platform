'use server'
import { db } from "@/drizzle/db"
import { users, UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { revalidateUserCache } from "./cache"
import { z } from "zod"
import bcrypt from "bcryptjs"



export async function getAuthUser(email: string) {
    // "use cache"
    // cacheTag(getUserIdTag(id))
    //console.log("Called")
  
    return db.query.users.findFirst({
      where: eq(users.email, email),
    })
  }


export async function insertAuthUser(data: typeof users.$inferInsert){

  const parsedData = z
            .object({name:z.string(), email: z.string().email(), password: z.string().min(6) })
            .safeParse(data);

  if (parsedData.success) {
    const {name, email, password} = parsedData.data
    const user = await getAuthUser(email)
    if (user?.email) {
      return { error: true, message: "User already exists" }
      throw new Error("User already exists")
    }

    const salt = await bcrypt.genSalt(10);
    

    const hashedPass = await bcrypt.hash(password, salt);  
    const [newUser] = await db
    .insert(users)
    .values({name, email, password: hashedPass})
    .returning()

    if (newUser == null) {
      return { error: true, message: "There was an error creating your account" }
      //throw new Error("Failed to create user")
    }

    insertUser({...newUser, clerkUserId: newUser.id})

    return { error: false, message: "New User successfully created" }  
    //return newUser
    

  }          
  
  return { error: true, message: "There was an error creating your account" }

  
}





export async function insertUser(data: typeof UserTable.$inferInsert) {
    const [newUser] = await db
      .insert(UserTable)
      .values(data)
      .returning()
      .onConflictDoUpdate({
        target: [UserTable.clerkUserId],
        set: data,
      })
  
    if (newUser == null) throw new Error("Failed to create user")
    revalidateUserCache(newUser.id)
  
    return newUser
}
  
export async function updateUser(
{ clerkUserId }: { clerkUserId: string },
data: Partial<typeof UserTable.$inferInsert>
) {
const [updatedUser] = await db
    .update(UserTable)
    .set(data)
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning()

if (updatedUser == null) throw new Error("Failed to update user")
revalidateUserCache(updatedUser.id)

return updatedUser
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
const [deletedUser] = await db
    .update(UserTable)
    .set({
    deletedAt: new Date(),
    email: "redacted@deleted.com",
    name: "Deleted User",
    clerkUserId: "deleted",
    imageUrl: null,
    })
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning()

if (deletedUser == null) throw new Error("Failed to delete user")
revalidateUserCache(deletedUser.id)

return deletedUser
}