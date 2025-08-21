"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function StatusPage() {
	const [connectionStatus, setConnectionStatus] = useState<string>("Testing...")
	const [connectionError, setConnectionError] = useState<string>("")
	const [supabaseInfo, setSupabaseInfo] = useState<any>({})

	useEffect(() => {
		testConnection()
	}, [])

	async function testConnection() {
		try {
			const supabase = createClient()
			
			// Test basic connection
			const { data, error } = await supabase
				.from("questions")
				.select("count", { count: "exact", head: true })

			if (error) {
				setConnectionStatus("Error")
				setConnectionError(`Connection error: ${error.message}`)
			} else {
				setConnectionStatus("Connected")
				setConnectionError("")
			}

			// Get Supabase info
			setSupabaseInfo({
				url: process.env.NEXT_PUBLIC_SUPABASE_URL,
				anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + "...",
			})
		} catch (error) {
			setConnectionStatus("Error")
			setConnectionError(`Connection error: ${error}`)
		}
	}

	return (
		<div className="min-h-screen bg-[#E8F4F8] flex items-center justify-center">
			<div className="max-w-2xl mx-auto px-6 py-12">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-[#000022] mb-4">
						Supabase Connection Test
					</h1>
					<p className="text-[#005E7C]">
						Testing connection to your local Supabase instance
					</p>
				</div>

				{/* Connection Status */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6 mb-6">
					<h2 className="text-xl font-semibold text-[#000022] mb-4">
						Connection Status:
					</h2>
					<div className="space-y-2">
						<div className="text-[#16A34A] font-medium">{connectionStatus}</div>
						{connectionError && (
							<div className="text-[#DC2626] text-sm">{connectionError}</div>
						)}
					</div>
				</div>

				{/* Local Supabase Info */}
				<div className="bg-[#E8F4F8] rounded-lg p-6 mb-6">
					<h2 className="text-xl font-semibold text-[#000022] mb-4">
						Local Supabase Info:
					</h2>
					<div className="space-y-2 text-sm text-[#005E7C]">
						<div>API URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</div>
						<div>Studio URL: http://127.0.0.1:54323</div>
						<div>Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres</div>
					</div>
				</div>

				{/* Navigation */}
				<div className="text-center">
					<Link
						href="/"
						className="text-[#0094C6] hover:text-[#001242] transition-colors"
					>
						← Back to Home
					</Link>
				</div>
			</div>
		</div>
	)
}
