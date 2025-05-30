"use client"

import { useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthContext } from "@/app/context/AuthContext"
import PageLoader from "./loaders/PageLoader"


const ProtectedRoute = ({ children }) => {
  const { user, loading, googleLogin } = useContext(AuthContext)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  console.log("ProtectedRoute", user, loading)
  const searchParams = useSearchParams();
  
    useEffect(() => {
      console.log("token on protected routes", searchParams.get('token'))
      if (searchParams.get('token')) {
        googleLogin(searchParams.get('token'))
      }
    }, [searchParams])

  useEffect(() => {
    setIsClient(true) 
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login") // Redirect if not authenticated
    }
  }, [loading, user, router])

  // Show loading or prevent render on server
  if (loading || !isClient) return <PageLoader/>

  // Render the protected content
  return <>{children}</>
}

export default ProtectedRoute
