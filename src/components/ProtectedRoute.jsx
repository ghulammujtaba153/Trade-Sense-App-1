"use client"

import { useContext, useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { AuthContext } from "@/app/context/AuthContext"
import PageLoader from "./loaders/PageLoader"

const EXCLUDED_ROUTES = ["/delete-account", "/support"]

const ProtectedRoute = ({ children }) => {
  const { user, loading, googleLogin } = useContext(AuthContext)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      googleLogin(token)
    }
  }, [searchParams])

  useEffect(() => {
    const isExcluded = EXCLUDED_ROUTES.includes(pathname)
    if (!loading && !user && !isExcluded) {
      router.push("/login")
    }
  }, [loading, user, router, pathname])

  if ((loading && !EXCLUDED_ROUTES.includes(pathname)) || !isClient) {
    return <PageLoader />
  }

  return <>{children}</>
}

export default ProtectedRoute
