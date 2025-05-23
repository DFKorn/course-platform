import { Button } from "@/components/ui/button";
import { canAccessAdminPages } from "@/permissions/general";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { auth } from "../../../auth";
import { SignOut } from "@/components/signOut";
import { getAuthUser, insertUser, synUsers } from "@/features/users/db/users";
import { Session } from "next-auth";
import { after } from "next/server";

export default function ConsumerLayout({
    children,
  }: Readonly<{ children: ReactNode }>) {
    return (
      <>
       <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
       </Suspense>
       
        {children}
      </>
    )
  }


async function Navbar() {
  const session = await auth()
  after(() => {
    if(session != null){synUsers(session)}
  })
  
    return (
      <header className="flex h-12 shadow bg-background z-10">
        <nav className="flex gap-4 container">
            <Link
            className="mr-auto text-lg hover:underline flex items-center"
            href="/"
            >
            Course Platform
            </Link>
            {session?.user ? (
              <Suspense>
            {/* <SignedIn> */}
            
            <AdminLink />
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/courses"
            >
              My Courses
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/purchases"
            >
              Purchase History
            </Link>
            <div className="size-8 self-center">
              {/* <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: "100%", height: "100%" },
                  },
                }}
              /> */}
              <SignOut/>
            </div>
          {/* </SignedIn> */}
          </Suspense>
          ) : (
            <Suspense>
            {/* <SignedOut> */}
              <Button className="self-center" asChild>
                {/* <SignInButton>Sign In</SignInButton> */}
                <Link href='/sign-in'>Sign In</Link>
              </Button>
            {/* </SignedOut> */}
          </Suspense>
          )}
            
          
        </nav>
        </header>
    )
}


async function AdminLink() {
  const session = await auth()
  const user = session?.user
  if (user == undefined || !canAccessAdminPages(user)) return null
  // const user = await getCurrentUser()
  // if (!canAccessAdminPages(user)) return null

  return (
    <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
      Admin
    </Link>
  )
}


function NavbarSkeleton() {
  
    return (
      <header className="flex h-12 shadow bg-background z-10">
        <nav className="flex gap-4 container">
            <Link
            className="mr-auto text-lg hover:underline flex items-center"
            href="/"
            >
            Web Dev Simplified
            </Link>
            
              <Button className="self-center" asChild>
                {/* <SignInButton>Sign In</SignInButton> */}
                <Link href='sign-in'>Sing In</Link>
              </Button>
          
        </nav>
        </header>
    )
}