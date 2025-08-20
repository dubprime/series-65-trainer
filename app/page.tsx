"use client"

import { useAuth } from "@/lib/contexts/AuthContext"
import Link from "next/link"

export default function Home() {
	const { user } = useAuth()

	return (
		<div className="min-h-screen bg-[#E8F4F8]">
			<div className="max-w-4xl mx-auto px-6 py-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-[#000022] mb-4">
						Theme Train
					</h1>
					<p className="text-xl text-[#005E7C]">
						Series 65 Study App - Interactive Exam Preparation
					</p>
				</div>

				{user && (
					<div className="bg-white border border-[#0094C6] rounded-lg p-6 mb-8 shadow-sm">
						<h2 className="text-xl font-semibold text-[#001242] mb-2">
							🎉 Welcome back, {user.user_metadata?.first_name || user.email}!
						</h2>
						<p className="text-[#005E7C] mb-4">
							You&apos;re signed in and ready to continue studying.
						</p>
						<Link
							href="/dashboard"
							className="inline-block bg-[#0094C6] text-white px-6 py-2 rounded-lg hover:bg-[#001242] transition-colors"
						>
							Go to Dashboard
						</Link>
					</div>
				)}

				<div className="grid md:grid-cols-2 gap-8 mb-12">
					<div className="bg-white border border-[#16A34A] rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold text-[#16A34A] mb-4">
							✅ Project Status: Ready
						</h2>
						<p className="text-[#005E7C] mb-4">
							Milestone 1 completed successfully! The scaffold is ready for
							development.
						</p>
						<ul className="text-sm text-[#005E7C] space-y-1">
							<li>• Next.js 15.4.7 with App Router</li>
							<li>• TailwindCSS v4 configured</li>
							<li>• Supabase client integration</li>
							<li>• Health check endpoint</li>
							<li>• Local development environment</li>
						</ul>
					</div>

					<div className="bg-white border border-[#0094C6] rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold text-[#001242] mb-4">
							🔧 Development Tools
						</h2>
						<p className="text-[#005E7C] mb-4">
							Local development environment is running and ready.
						</p>
						<ul className="text-sm text-[#005E7C] space-y-1">
							<li>• App: http://localhost:3000</li>
							<li>• Supabase API: http://127.0.0.1:54321</li>
							<li>• Database Studio: http://127.0.0.1:54323</li>
							<li>• Database: postgresql://127.0.0.1:54322</li>
						</ul>
					</div>
				</div>

				<div className="bg-white border border-[#005E7C] rounded-lg p-6 mb-8 shadow-sm">
					<h2 className="text-xl font-semibold text-[#001242] mb-4">
						🚀 Next Steps
					</h2>
					<p className="text-[#005E7C] mb-4">
						The foundation is complete. Ready to move to:
					</p>
					<div className="grid md:grid-cols-3 gap-4">
						<div className="bg-[#E8F4F8] p-4 rounded border border-[#0094C6]">
							<h3 className="font-semibold text-[#001242] mb-2">
								Database Setup
							</h3>
							<p className="text-sm text-[#005E7C]">
								Create tables and enable RLS
							</p>
						</div>
						<div className="bg-[#E8F4F8] p-4 rounded border border-[#0094C6]">
							<h3 className="font-semibold text-[#001242] mb-2">
								Authentication
							</h3>
							<p className="text-sm text-[#005E7C]">
								Implement user auth system
							</p>
						</div>
						<div className="bg-[#E8F4F8] p-4 rounded border border-[#0094C6]">
							<h3 className="font-semibold text-[#001242] mb-2">
								Questions Module
							</h3>
							<p className="text-sm text-[#005E7C]">
								Build the core study functionality
							</p>
						</div>
					</div>
				</div>

				<div className="text-center">
					<div className="inline-flex space-x-4">
						<Link
							href="/health"
							className="bg-[#16A34A] text-white px-6 py-3 rounded-lg hover:bg-[#15803D] transition-colors"
						>
							Health Check
						</Link>
						<Link
							href="/test-supabase"
							className="bg-[#0094C6] text-white px-6 py-3 rounded-lg hover:bg-[#001242] transition-colors"
						>
							Test Database
						</Link>
						{!user && (
							<Link
								href="/auth/signup"
								className="bg-[#0094C6] text-white px-6 py-3 rounded-lg hover:bg-[#001242] transition-colors"
							>
								Get Started
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
