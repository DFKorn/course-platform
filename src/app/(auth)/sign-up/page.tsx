import OAuthForm from "@/components/OAuthForm";
import SignUpForm from "@/components/signUpForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PictureInPicture2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { House,ChevronLeft } from 'lucide-react';


export default function SignUpPage(){

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'absolute left-4 top-4 md:left-8 md:top-8'
                )}
            >
                <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                {/* <House className="mr-2 h-4 w-4" /> */}
                    Home
                </>
            </Link>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <div className="w-12 h-12 mx-auto relative">
                    <PictureInPicture2 className="mr-2 h-12 w-12 text-(--accent)" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and password to start learning
                </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <SignUpForm />
            </Suspense>
            <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">
                            Or continue with
                        </span>
                    </div>
                </div>
            <Suspense>
                <OAuthForm />
                {/* <OAuthForm searchParams={searchParams}/> */}
            </Suspense>
            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/sign-in"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Already have an account? Sign In
                </Link>
            </p>
        </div>
    </div>
    
      )

}