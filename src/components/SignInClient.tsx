'use client'
import { Button } from "./ui/button";
import { signIn} from "next-auth/react"
import Image from 'next/image'

export function SignInCl({
  provider,
  ...props
}: { provider?: { id: string, name: string } } & React.ComponentPropsWithRef<typeof Button>) {
  return (
   
    <Button onClick={() => signIn(provider?.id, {redirectTo: "/"})} {...props} variant={'outline'}>
      <Image className='w-[20px]' width={20} height={20} src={`https://authjs.dev/img/providers/${provider?.id}.svg`} alt={`${provider?.id} provider`}/>
      {`${provider?.name}`}
    </Button>

  )
}