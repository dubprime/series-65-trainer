"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function Navigation() {
	const { user, signOut } = useAuth()
	const pathname = usePathname()

	function getLinkStyle(href: string) {
		const isActive =
			pathname === href ||
			(href !== "/" && pathname.startsWith(href)) ||
			(href === "/" && pathname === "/")

		return isActive
			? "text-[#0094C6] font-semibold border-b-2 border-[#0094C6] pb-1"
			: "text-[#005E7C] hover:text-[#001242] transition-colors"
	}

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
								<Link href="/" className={getLinkStyle("/")}>
									Dashboard
								</Link>
								<Link href="/questions" className={getLinkStyle("/questions")}>
									Questions
								</Link>
								<Link href="/analytics" className={getLinkStyle("/analytics")}>
									Analytics
								</Link>
								<Link
									href="/study-manager"
									className={getLinkStyle("/study-manager")}
								>
									Study Manager
								</Link>
								<Link
									href="/vocab-test"
									className={getLinkStyle("/vocab-test")}
								>
									Vocab Test
								</Link>
								<Link href="/help" className={getLinkStyle("/help")}>
									Help
								</Link>
								<Link href="/status" className={getLinkStyle("/status")}>
									Status
								</Link>
								<Link href="/settings" className={getLinkStyle("/settings")}>
									Settings
								</Link>
								<button
									onClick={signOut}
									className="text-[#005E7C] hover:text-[#001242] transition-colors"
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
