'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { insertAuthUser } from "@/features/users/db/users";

import { actionToast } from "./ui/actionToast";
import { useRouter } from "next/navigation";



export const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters."}),
  })


export default function SignUpForm(){
  const router = useRouter()

 const form = useForm<z.infer<typeof signUpSchema>>({
           resolver: zodResolver(signUpSchema),
           defaultValues: {
             name: "",
             email: "",
             password: "",
           },
         })  
         
 async function onSubmit(values: z.infer<typeof signUpSchema>) {
        //  await signIn("credentials", values)
            
            const data = await insertAuthUser(values)
            actionToast({ actionData: data })
            if (!data.error) {router.push('/sign-in')}
     }

     return(
        
        <div className="flex flex-col gap-2">
      <Form {...form}>
      {/* {error &&
        ( <div className="flex items-end space-x-1"
                aria-live="polite"
                aria-atomic="true">
            <CircleAlert className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
        </div> )  
            } */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col @container"
      >
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name
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
            Sign Up
          </Button>
        </div> 
      </form>
      </Form>
      
    </div>
    )

}