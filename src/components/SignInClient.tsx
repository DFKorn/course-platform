'use client'
import { Button } from "./ui/button";
import { signIn} from "next-auth/react"

export function SignInCl({
  provider,
  ...props
}: { provider?: { id: string, name: string } } & React.ComponentPropsWithRef<typeof Button>) {
  return (
   
    <Button onClick={() => signIn(provider?.id, {redirectTo: "/"})} {...props} variant={'outline'}>
      <img className='w-[20px]' src={`https://authjs.dev/img/providers/${provider?.id}.svg`}/>
      {`${provider?.name}`}
    </Button>

  )
}