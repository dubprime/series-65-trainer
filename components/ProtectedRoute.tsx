"use client"

import { useAuth } from "@/lib/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
	children: React.ReactNode
	redirectTo?: string
}

export default function ProtectedRoute({
	children,
	redirectTo = "/auth/signin",
}: ProtectedRouteProps) {
	const { user, loading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!loading && !user) {
			router.push(redirectTo)
		}
	}, [user, loading, router, redirectTo])

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094C6] mx-auto"></div>
					<p className="mt-4 text-[#005E7C]">Loading...</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return null // Will redirect in useEffect
	}

	return <>{children}</>
}
