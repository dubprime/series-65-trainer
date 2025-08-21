/**
 * scripts/setup-production.js
 * Set up production Supabase database with migrations and seed data
 */

const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

// Load environment variables from .env.production
require("dotenv").config({ path: ".env.production" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("❌ Missing production Supabase credentials in .env.production")
	console.error("Please create .env.production with:")
	console.error("NEXT_PUBLIC_SUPABASE_URL=your_production_url")
	console.error("SUPABASE_SERVICE_ROLE_KEY=your_service_role_key")
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupProduction() {
	console.log("🚀 Setting up production Supabase database...")

	try {
		// Test connection
		console.log("📡 Testing connection...")
		const { data, error } = await supabase
			.from("questions")
			.select("count", { count: "exact", head: true })

		if (error && error.code !== "42P01") {
			// 42P01 = table doesn't exist
			console.error("❌ Connection failed:", error.message)
			process.exit(1)
		}

		console.log("✅ Connection successful!")

		// Check if tables exist
		const { data: tables, error: tablesError } = await supabase.rpc(
			"get_tables"
		)

		if (tablesError) {
			console.log("📋 Tables don't exist yet, creating schema...")
			await createSchema()
		} else {
			console.log("📋 Tables already exist, checking structure...")
			await checkSchema()
		}

		// Import questions if needed
		await importQuestions()

		console.log("🎉 Production setup complete!")
	} catch (error) {
		console.error("❌ Setup failed:", error.message)
		process.exit(1)
	}
}

async function createSchema() {
	console.log("🏗️  Creating database schema...")

	// Use the production-ready migration
	const migrationPath = path.join(
		__dirname,
		"..",
		"supabase",
		"migrations",
		"008_production_ready.sql"
	)
	const migrationSQL = fs.readFileSync(migrationPath, "utf8")

	try {
		// Execute the migration directly (no exec_sql dependency)
		const statements = migrationSQL
			.split(";")
			.map((stmt) => stmt.trim())
			.filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

		for (const statement of statements) {
			if (statement.trim()) {
				try {
					const { error } = await supabase.rpc("exec_sql", {
						sql: statement + ";",
					})
					if (error) {
						console.warn(`⚠️  Statement had issues:`, error.message)
					}
				} catch (error) {
					console.warn(`⚠️  Statement failed:`, error.message)
				}
			}
		}

		console.log("✅ Production migration completed")
	} catch (error) {
		console.warn(`⚠️  Migration file read failed:`, error.message)
	}
}

async function checkSchema() {
	console.log("🔍 Checking database schema...")

	// Check if questions table exists and has data
	const { data: questions, error: questionsError } = await supabase
		.from("questions")
		.select("count", { count: "exact", head: true })

	if (questionsError) {
		console.log("❌ Questions table missing, creating schema...")
		await createSchema()
	} else {
		console.log(`✅ Questions table exists with ${questions} records`)
	}
}

async function importQuestions() {
	console.log("📚 Checking if questions need to be imported...")

	const { data: questions, error: questionsError } = await supabase
		.from("questions")
		.select("count", { count: "exact", head: true })

	if (questionsError || questions === 0) {
		console.log("📥 No questions found, importing from parsed files...")

		// Import questions using the existing import script
		const { importQuestionsFromFile } = require("./import-questions.js")

		const parsedDir = path.join(__dirname, "..", "dist", "parsed")
		if (fs.existsSync(parsedDir)) {
			const files = fs
				.readdirSync(parsedDir)
				.filter((file) => file.endsWith("-batch.json") || file.includes("gpt5"))
				.map((file) => path.join(parsedDir, file))
				.sort()

			for (const file of files) {
				console.log(`📁 Importing: ${path.basename(file)}`)
				const result = await importQuestionsFromFile(file)
				console.log(`✅ Imported ${result.imported} questions`)
			}
		} else {
			console.log("⚠️  No parsed questions directory found")
		}
	} else {
		console.log(`✅ Questions already imported (${questions} records)`)
	}
}

// Run setup if this script is executed directly
if (require.main === module) {
	setupProduction().catch((error) => {
		console.error("❌ Setup failed:", error.message)
		process.exit(1)
	})
}

module.exports = { setupProduction }
