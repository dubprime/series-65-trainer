"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function TestSupabase() {
	const [status, setStatus] = useState<string>("Testing...")
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function testConnection() {
			try {
				const supabase = createClient()
				const { error } = await supabase
					.from("_dummy_table_")
					.select("*")
					.limit(1)

				if (error) {
					// This is expected - the table doesn't exist yet
					if (error.code === "42P01") {
						// table doesn't exist
						setStatus(
							"✅ Supabase connection successful! (Table does not exist yet, which is expected)"
						)
					} else {
						setError(`Connection error: ${error.message}`)
					}
				} else {
					setStatus("✅ Supabase connection successful!")
				}
			} catch (err) {
				setError(
					`Failed to connect: ${
						err instanceof Error ? err.message : "Unknown error"
					}`
				)
			}
		}

		testConnection()
	}, [])

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>

			<div className="bg-gray-100 p-4 rounded-lg">
				<h2 className="font-semibold mb-2">Connection Status:</h2>
				<p className="text-green-600">{status}</p>
				{error && <p className="text-red-600 mt-2">Error: {error}</p>}
			</div>

			<div className="mt-6 bg-blue-50 p-4 rounded-lg">
				<h2 className="font-semibold mb-2">Local Supabase Info:</h2>
				<ul className="text-sm space-y-1">
					<li>
						<strong>API URL:</strong> http://127.0.0.1:54321
					</li>
					<li>
						<strong>Studio URL:</strong> http://127.0.0.1:54323
					</li>
					<li>
						<strong>Database URL:</strong>{" "}
						postgresql://postgres:postgres@127.0.0.1:54322/postgres
					</li>
				</ul>
			</div>

			<div className="mt-6">
				<Link href="/" className="text-blue-600 hover:underline">
					← Back to Home
				</Link>
			</div>
		</div>
	)
}
