#!/usr/bin/env node

/**
 * Quick script to create a test user account for development
 * Run this after a db reset to quickly get back to testing
 *
 * Usage: node scripts/create-test-user.js
 */

const { createClient } = require("@supabase/supabase-js")

// Test user credentials
const TEST_USER = {
	email: "test@example.com",
	password: "testpass123",
	firstName: "Test",
	lastName: "User",
}

async function createTestUser() {
	console.log("🚀 Creating test user account...")

	// Initialize Supabase client
	const supabase = createClient(
		"http://127.0.0.1:54321",
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
	)

	try {
		// Sign up the test user
		const { data, error } = await supabase.auth.signUp({
			email: TEST_USER.email,
			password: TEST_USER.password,
			options: {
				data: {
					first_name: TEST_USER.firstName,
					last_name: TEST_USER.lastName,
				},
			},
		})

		if (error) {
			console.error("❌ Error creating user:", error.message)
			return
		}

		if (data.user) {
			console.log("✅ Test user created successfully!")
			console.log("📧 Email:", TEST_USER.email)
			console.log("🔑 Password:", TEST_USER.password)
			console.log("👤 Name:", `${TEST_USER.firstName} ${TEST_USER.lastName}`)
			console.log("\n💡 You can now sign in with these credentials")
		} else {
			console.log("⚠️  User creation initiated, check email for confirmation")
		}
	} catch (err) {
		console.error("❌ Unexpected error:", err.message)
	}
}

// Run the script
createTestUser()
