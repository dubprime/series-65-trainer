"use client"

import { useState } from "react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { signIn } = useAuth()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			const { error } = await signIn(email, password)

			if (error) {
				setError(error.message)
			} else {
				// Redirect to dashboard or home page
				router.push("/")
			}
		} catch (err) {
			setError("An unexpected error occurred")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#E8F4F8] py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-[#000022]">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-[#005E7C]">
						Continue your Series 65 study journey
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email-address" className="sr-only">
								Email address
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#005E7C] placeholder-[#005E7C] text-[#000022] rounded-t-md focus:outline-none focus:ring-[#0094C6] focus:border-[#0094C6] focus:z-10 sm:text-sm"
								placeholder="Email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#005E7C] placeholder-[#005E7C] text-[#000022] rounded-b-md focus:outline-none focus:ring-[#0094C6] focus:border-[#0094C6] focus:z-10 sm:text-sm"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					{error && (
						<div className="text-[#DC2626] text-sm text-center">{error}</div>
					)}

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0094C6] hover:bg-[#001242] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0094C6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? "Signing in..." : "Sign in"}
						</button>
					</div>

					<div className="text-center">
						<Link
							href="/auth/signup"
							className="font-medium text-[#0094C6] hover:text-[#001242] transition-colors"
						>
							Don&apos;t have an account? Sign up
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}
