// 'use client'

import { SignIn } from '@clerk/nextjs'
import { Suspense } from 'react'

// export default function Page() {
//   return <SignIn fallback={<div>Loading...</div>}/>
// }


function FallbackSkeleton() {
  return <div>Loading...</div>
}

export default function Page() {
  return (
    <Suspense fallback={<FallbackSkeleton />}>
      <SignIn fallback={<FallbackSkeleton />}/>
    </Suspense>
  )
}