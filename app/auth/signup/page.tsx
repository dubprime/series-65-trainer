"use client"

import { useState } from "react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUp() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [message, setMessage] = useState<string | null>(null)

	const { signUp } = useAuth()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setMessage(null)

		// Validation
		if (password !== confirmPassword) {
			setError("Passwords do not match")
			return
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long")
			return
		}

		setLoading(true)

		try {
			const { error } = await signUp(email, password, {
				first_name: firstName,
				last_name: lastName,
			})

			if (error) {
				setError(error.message)
			} else {
				setMessage("Check your email for the confirmation link!")
				// Don't redirect immediately - user needs to confirm email
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
				{/* Navigation Header */}
				<div className="text-center">
					<Link
						href="/"
						className="text-[#0094C6] hover:text-[#001242] transition-colors text-sm"
					>
						← Back to Home
					</Link>
				</div>

				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-[#000022]">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-[#005E7C]">
						Start your Series 65 study journey
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label htmlFor="first-name" className="sr-only">
									First name
								</label>
								<input
									id="first-name"
									name="firstName"
									type="text"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#005E7C] placeholder-[#005E7C] text-[#000022] rounded-tl-md rounded-bl-md focus:outline-none focus:ring-[#0094C6] focus:border-[#0094C6] focus:z-10 sm:text-sm"
									placeholder="First name"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="last-name" className="sr-only">
									Last name
								</label>
								<input
									id="last-name"
									name="lastName"
									type="text"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#005E7C] placeholder-[#005E7C] text-[#000022] rounded-tr-md rounded-br-md focus:outline-none focus:ring-[#0094C6] focus:border-[#0094C6] focus:z-10 sm:text-sm"
									placeholder="Last name"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</div>
						</div>
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
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#005E7C] placeholder-[#005E7C] text-[#000022] focus:outline-none focus:ring-[#0094C6] focus:border-[#0094C6] focus:z-10 sm:text-sm"
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
								autoComplete="new-password"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#005E7C] placeholder-[#005E7C] text-[#000022] focus:outline-none focus:ring-[#0094C6] focus:border-[#0094C6] focus:z-10 sm:text-sm"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="confirm-password" className="sr-only">
								Confirm password
							</label>
							<input
								id="confirm-password"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#005E7C] placeholder-[#005E7C] text-[#000022] rounded-b-md focus:outline-none focus:ring-[#0094C6] focus:border-[#0094C6] focus:z-10 sm:text-sm"
								placeholder="Confirm password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
					</div>

					{error && (
						<div className="text-[#DC2626] text-sm text-center">{error}</div>
					)}

					{message && (
						<div className="text-[#16A34A] text-sm text-center">{message}</div>
					)}

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0094C6] hover:bg-[#001242] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0094C6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? "Creating account..." : "Sign up"}
						</button>
					</div>

					<div className="text-center">
						<Link
							href="/auth/signin"
							className="font-medium text-[#0094C6] hover:text-[#001242] transition-colors"
						>
							Already have an account? Sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}
