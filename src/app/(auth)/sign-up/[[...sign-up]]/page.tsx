// 'use client'

import { SignUp } from '@clerk/nextjs'
import { Suspense } from 'react'

// export default function Page() {
//   return <SignUp fallback={<div>Loading...</div>}/>
// }


function FallbackSkeleton() {
  return <div>Loading...</div>
}


export default function Page() {
  return (
    <Suspense fallback={<FallbackSkeleton/>}> 
      <SignUp fallback={<FallbackSkeleton/>}/>
    </Suspense>
  )
}