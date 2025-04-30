import { LoadingSpinner } from "@/components/LoadingSpinner"
import OAuthForm from "@/components/OAuthForm"
import { PageHeader } from "@/components/PageHeader"
import SignInForm from "@/components/SignInForm"
import SignUpForm from "@/components/signUpForm"
import { buttonVariants } from "@/components/ui/button"
import { db } from "@/drizzle/db"
import { ProductTable } from "@/drizzle/schema"
import { getProductIdTag } from "@/features/products/db/cache"
import { userOwnsProduct } from "@/features/products/db/products"
import { wherePublicProducts } from "@/features/products/permissions/products"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/services/clerk"
import { StripeCheckoutForm } from "@/services/stripe/components/StripeCheckoutForm"
import { SignIn, SignUp } from "@clerk/nextjs"
import { and, eq } from "drizzle-orm"
import { ChevronLeft, PictureInPicture2 } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

export default function PurchasePage({
  params,
  //searchParams,
}: {
  params: Promise<{ productId: string }>
  //searchParams: Promise<{ authMode: string }>
}) {
  return (
    <Suspense fallback={<LoadingSpinner className="my-6 size-36 mx-auto" />}>
      <SuspendedComponent params={params} 
      //searchParams={searchParams} 
      />
    </Suspense>
  )
}

async function SuspendedComponent({
  params,
  //searchParams,
}: {
  params: Promise<{ productId: string }>
  //searchParams: Promise<{ authMode: string }>
}) {
  const { productId } = await params
  const { user } = await getCurrentUser({ allData: true })
  const product = await getPublicProduct(productId)

  if (product == null) return notFound()

  if (user != null) {
    if (await userOwnsProduct({ userId: user.id, productId })) {
      redirect("/courses")
    }

    return (
      <div className="container my-6">
        <StripeCheckoutForm product={product} user={user} />
      </div>
    )
  }

  // const { authMode } = await searchParams
  // const isSignUp = authMode === "signUp"

  return (
    <div className="container my-6 flex flex-col items-center">
      <PageHeader title="You need an account to make a purchase" />
     
      <div className="container flex h-screen w-full flex-col items-center flex-start ">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
            <div className="w-12 h-12 mx-auto relative">
                <PictureInPicture2 className="mr-2 h-12 w-12 text-(--accent)" />
            </div>
            
            <p className="text-sm text-muted-foreground">
                Enter your email and password to sign in to your account
            </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
            <SignInForm />
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
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
                href="/sign-up"
                className="hover:text-brand underline underline-offset-4"
            >
                Don&apos;t have an account? Sign Up
            </Link>
        </p>
    </div>
</div>
     
      
    </div>
  )
}

async function getPublicProduct(id: string) {
  "use cache"
  cacheTag(getProductIdTag(id))

  return db.query.ProductTable.findFirst({
    columns: {
      name: true,
      id: true,
      imageUrl: true,
      description: true,
      priceInDollars: true,
    },
    where: and(eq(ProductTable.id, id), wherePublicProducts),
  })
}