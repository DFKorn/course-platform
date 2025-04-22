import { signIn } from "../../auth"
import { Button } from "./ui/button"
 
export default function SignIn({provider,...props}:{ provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(provider)
      }}
    >
      <Button {...props}>Sign In</Button>
      {/* <button type="submit">Signin with GitHub</button> */}
    </form>
  )
} 


