import { UserCourseAccessTable } from "@/drizzle/schema"
import { revalidateUserCourseAccessCache } from "./cache/userCourseAccess"
import { db } from "@/drizzle/db"

export async function addUserCourseAccess(
    {
      userId,
      courseIds,
    }: {
      userId: string
      courseIds: string[]
    },
    trx: Omit<typeof db, "$client"> = db
  ) {
    const accesses = await trx
      .insert(UserCourseAccessTable)
      .values(courseIds.map(courseId => ({ userId, courseId })))
      .onConflictDoNothing()
      .returning()
  
    accesses.forEach(revalidateUserCourseAccessCache)
  
    return accesses
  }
  