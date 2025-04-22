'use client'

//import { signIn, auth, providerMap } from "../../auth" 
//import { signIn } from "next-auth/react"
import { AuthError } from "next-auth"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { actionToast } from "@/components/ui/actionToast"
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon"
import { Input } from "@/components/ui/input"
import { error } from "console"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { useRouter } from 'next/navigation';
import { use, useActionState } from "react"
import { authenticate } from "@/app/(auth)/sign-in/action"
import { ErrorMessage } from "@hookform/error-message"





export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."}),
})



export default function _SignInForm({params}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const router = useRouter();
  

  

  const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    })

//   let action = async (values:z.infer<typeof signInSchema>) => {
   
//     await signIn('credentials', {
//       email: values.email,
//       password: values.password,
     
//   });
//   } 

  // async function onSubmit(values: z.infer<typeof signInSchema>) {
      
  //     //await action(values)
  //     //await signIn("credentials", values, { redirectTo: "/" })
  //     try {
  //           await signIn("credentials", values)
  //           console.log(form.formState.errors)
  //         } catch (error) {
  //           console.log(error)
  //         }
  //    // const data = await signIn('credentials', values)
  //     //let data = {error:false, message: 'cool'}
  //     //actionToast({ actionData: data })
    
  //   }

  return (
    
    <div className="flex flex-col gap-2">
      <Form {...form}>
      <form
        onSubmit={form.handleSubmit(authenticate)}
        // action={async (formData) => {
        //   "use server"
        //   try {
        //     await signIn("credentials", formData)
        //   } catch (error) {
        //     if (error instanceof AuthError) {
        //     //   return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
        //       return redirect(`/`)
        //     }
        //     throw error
        //   }
        // }}
      >
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
        <div>({Object.keys(form.formState)})</div>
        <div>{params && Object.keys(params)}</div>
        {/* <label htmlFor="email">
          Email
          <input name="email" id="email" />
        </label>
        <label htmlFor="password">
          Password
          <input name="password" id="password" />
        </label>
        <input type="submit" value="Sign In" /> */}
      </form>
      </Form>
      {/* {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            "use server"
            try {
              await signIn(provider.id, {
                redirectTo: params?.callbackUrl ?? "",
              })
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              if (error instanceof AuthError) {
                // return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                return redirect(`/`)
              }
 
              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error
            }
          }}
        >
          <button type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
        
      ))} */}
    </div>
  )
}










// import { signIn, auth, providerMap } from "../../auth"

 
// export default function SignInPage(props: {
//   searchParams: { callbackUrl: string | undefined }
// }) {
//   const [errorMessage, formAction, isPending] = useActionState(
//     authenticate,
//     undefined,
//   );
//   return (
//     <div className="flex flex-col gap-2">
//       <form
//         action={formAction}
//       >
//         <label htmlFor="email">
//           Email
//           <input name="email" id="email" />
//         </label>
//         <label htmlFor="password">
//           Password
//           <input name="password" id="password" />
//         </label>
//         <input type="submit" value="Sign In" />
//       </form>
//       {/* {Object.values(providerMap).map((provider) => (
//         <form
//           action={async () => {
//             "use server"
//             try {
//               await signIn(provider.id, {
//                 redirectTo: props.searchParams?.callbackUrl ?? "",
//               })
//             } catch (error) {
//               // Signin can fail for a number of reasons, such as the user
//               // not existing, or the user not having the correct role.
//               // In some cases, you may want to redirect to a custom error
//               if (error instanceof AuthError) {
//                 console.log(error.type)
//                 // return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
//               }
 
//               // Otherwise if a redirects happens Next.js can handle it
//               // so you can just re-thrown the error and let Next.js handle it.
//               // Docs:
//               // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
//               throw error
//             }
//           }}
//         >
//           <button type="submit">
//             <span>Sign in with {provider.name}</span>
//           </button>
//         </form>
//       ))} */}
//     </div>
//   )
// }