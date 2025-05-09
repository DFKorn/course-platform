'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { actionToast } from "./ui/actionToast"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useSearchParams } from "next/navigation"
import { CircleAlert } from 'lucide-react'




export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."}),
})


export default function SignInForm(){
    const searchParams = useSearchParams();
    const error = searchParams.get('error')
    const errorMessage = error == 'CredentialsSignin' ? 'The email or password you entered is incorrect, please try again.' : 'Something went wrong'
    //if(error){actionToast({actionData:{error: true, message: errorMessage}})}
    //console.log(error)

    const form = useForm<z.infer<typeof signInSchema>>({
          resolver: zodResolver(signInSchema),
          defaultValues: {
            email: "",
            password: "",
          },
        })

    
    async function onSubmit(values: z.infer<typeof signInSchema>) {
        await signIn("credentials", {...values, redirectTo: "/" })
       
    }

    return(
        
        <div className="flex flex-col gap-2">
      <Form {...form}>
      {error &&
        ( <div className="flex items-start space-x-1"
                aria-live="polite"
                aria-atomic="true">
            <CircleAlert className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
        </div> )  
            }
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col @container"
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
          <div>
          <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">
            Sign In
          </Button>
        </div> 
      </form>
      </Form>
      
    </div>
    )
        

}