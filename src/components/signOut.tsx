import { signOut } from "../../auth"
import { Button } from "./ui/button"
 
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({redirectTo: "/"})
      }}
    >
      <Button>Sign Out</Button>
      {/* <button type="submit"></button> */}
    </form>
  )
}