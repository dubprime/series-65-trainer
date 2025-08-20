"use client"

import Link from "next/link"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function Navigation() {
	const { user, signOut } = useAuth()

	return (
		<nav className="bg-white border-b border-[#E8F4F8] shadow-sm">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					<Link
						href="/"
						className="text-xl font-bold text-[#000022] hover:text-[#001242] transition-colors"
					>
						Theme Train
					</Link>

					<div className="flex items-center space-x-6">
						{user ? (
							<>
								<Link
									href="/dashboard"
									className="text-white hover:text-[#E8F4F8] transition-colors"
								>
									Dashboard
								</Link>
								<Link
									href="/questions"
									className="text-white hover:text-[#E8F4F8] transition-colors"
								>
									Questions
								</Link>
								<Link
									href="/analytics"
									className="text-white hover:text-[#E8F4F8] transition-colors"
								>
									Analytics
								</Link>
								<Link
									href="/study-manager"
									className="text-white hover:text-[#E8F4F8] transition-colors"
								>
									Study Manager
								</Link>
								<Link
									href="/help"
									className="text-white hover:text-[#E8F4F8] transition-colors"
								>
									Help
								</Link>
								<Link
									href="/settings"
									className="text-white hover:text-[#E8F4F8] transition-colors"
								>
									Settings
								</Link>
								<button
									onClick={signOut}
									className="text-white hover:text-[#E8F4F8] transition-colors"
								>
									Sign Out
								</button>
							</>
						) : (
							<>
								<Link
									href="/auth/signin"
									className="text-[#005E7C] hover:text-[#001242] transition-colors"
								>
									Sign In
								</Link>
								<Link
									href="/auth/signup"
									className="bg-[#0094C6] text-white px-4 py-2 rounded-md hover:bg-[#001242] transition-colors"
								>
									Sign Up
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	)
}
