"use client"

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/app/context/AuthContext"


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  console.log("ProtectedRoute", user, loading)

  useEffect(() => {
    setIsClient(true) // Ensures component is mounted on client
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login") // Redirect if not authenticated
    }
  }, [loading, user, router])

  // Show loading or prevent render on server
  if (loading || !isClient) return <div>Loading...</div>

  // Render the protected content
  return <>{children}</>
}

export default ProtectedRoute
