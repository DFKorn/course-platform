'use client'

import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <SignUp fallback={<div>Loading...</div>}/>
}