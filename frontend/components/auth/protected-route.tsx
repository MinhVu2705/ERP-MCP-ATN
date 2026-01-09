'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if already on login/signup pages
    const publicPaths = ['/login', '/signup', '/startup']
    if (publicPaths.some(path => pathname?.startsWith(path))) {
      return
    }

    // Only redirect if definitely unauthenticated
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router, pathname])

  // CRITICAL: Always render children immediately
  // This prevents UI blocking while auth state loads
  return <>{children}</>
}
