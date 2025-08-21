#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import fs from "fs"
import path from "path"

// Load environment variables
config({ path: ".env.production" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("❌ Missing Supabase credentials in .env.production")
	console.log("Please ensure you have:")
	console.log("- NEXT_PUBLIC_SUPABASE_URL")
	console.log("- SUPABASE_SERVICE_ROLE_KEY")
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupProduction() {
	try {
		console.log("🚀 Setting up production Supabase database...")

		// Test connection
		console.log("📡 Testing connection...")
		const { data, error } = await supabase
			.from("questions")
			.select("count", { count: "exact", head: true })

		if (error && error.code === "42P01") {
			// Table doesn't exist, create schema
			console.log("📋 Tables don't exist yet, creating schema...")
			await createSchema()
		} else if (error) {
			throw new Error(`Connection failed: ${error.message}`)
		} else {
			console.log("✅ Connection successful!")
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

	// Read the production migration
	const migrationPath = path.join(
		__dirname,
		"..",
		"supabase",
		"migrations",
		"008_production_ready.sql"
	)
	const migrationSQL = fs.readFileSync(migrationPath, "utf8")

	// Split into individual statements and execute them
	const statements = migrationSQL
		.split(";")
		.map((stmt) => stmt.trim())
		.filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

	for (const statement of statements) {
		if (statement.trim()) {
			try {
				// Execute each statement directly
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

	console.log("✅ Schema creation completed")
}

async function importQuestions() {
	console.log("📚 Checking if questions need to be imported...")

	const { count, error: countError } = await supabase
		.from("questions")
		.select("*", { count: "exact", head: true })

	if (countError) {
		console.log("❌ Error checking questions:", countError.message)
		return
	}

	if (count && count > 0) {
		console.log(`✅ Questions already exist (${count} records)`)
		return
	}

	console.log("📥 No questions found, importing from parsed files...")

	// Look for parsed question files
	const parsedDir = path.join(process.cwd(), "dist", "parsed")
	if (!fs.existsSync(parsedDir)) {
		console.log("📁 Creating parsed directory...")
		fs.mkdirSync(parsedDir, { recursive: true })
	}

	const files = fs.readdirSync(parsedDir)
	const jsonFiles = files.filter(
		(file) =>
			file.endsWith(".json") &&
			(file.includes("batch") || file.includes("gpt5"))
	)

	if (jsonFiles.length === 0) {
		console.log("📁 No parsed question files found in dist/parsed/")
		console.log("Please run the parsing scripts first:")
		console.log("1. pnpm run parse:exams")
		console.log("2. pnpm run import:questions")
		return
	}

	console.log(`📚 Found ${jsonFiles.length} question files to import`)

	let totalImported = 0

	for (const file of jsonFiles) {
		console.log(`📖 Processing ${file}...`)

		const filePath = path.join(parsedDir, file)
		const content = fs.readFileSync(filePath, "utf8")
		const questions = JSON.parse(content)

		if (!Array.isArray(questions)) {
			console.log(`⚠️  Skipping ${file} - not an array`)
			continue
		}

		// Convert to database format
		const dbQuestions = questions.map((q) => ({
			question_text: q.question,
			choices: q.choices,
			correct_answer: q.correct_answer,
			explanation: q.explanation || null,
			difficulty_level: q.difficulty || "medium",
			category: q.category || "General",
			tags: q.tags || [],
		}))

		// Insert in batches
		const batchSize = 50
		for (let i = 0; i < dbQuestions.length; i += batchSize) {
			const batch = dbQuestions.slice(i, i + batchSize)

			const { error } = await supabase.from("questions").insert(batch)

			if (error) {
				console.error(
					`❌ Error inserting batch ${i / batchSize + 1}:`,
					error.message
				)
				continue
			}

			console.log(
				`✅ Imported batch ${i / batchSize + 1} (${batch.length} questions)`
			)
			totalImported += batch.length

			// Small delay to avoid overwhelming the API
			await new Promise((resolve) => setTimeout(resolve, 100))
		}
	}

	console.log(`🎉 Import complete! Total questions imported: ${totalImported}`)
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	setupProduction().catch((error) => {
		console.error("❌ Setup failed:", error.message)
		process.exit(1)
	})
}

export { setupProduction }
