/**
 * scripts/import-questions.js
 * Import parsed questions from JSON files into Supabase database
 */

const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey =
	process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("❌ Missing Supabase credentials. Check your .env.local file.")
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Function to convert parsed question format to database format
function convertQuestionFormat(parsedQuestion) {
	// Extract the correct answer letter and find the corresponding choice text
	const correctAnswerLetter = parsedQuestion.correct[0]
	const correctChoice = parsedQuestion.choices.find(
		(choice) => choice.id === correctAnswerLetter
	)

	if (!correctChoice) {
		console.warn(
			`⚠️  Could not find correct choice for question: ${parsedQuestion.stem.substring(
				0,
				50
			)}...`
		)
		return null
	}

	// Convert choices to the database format
	const choices = parsedQuestion.choices.map((choice) => ({
		text: choice.text,
		is_correct: choice.id === correctAnswerLetter,
	}))

	return {
		question_text: parsedQuestion.stem,
		question_type: "multiple_choice",
		choices: choices,
		correct_answer: correctChoice.text,
		explanation: parsedQuestion.rationale,
		category: parsedQuestion.module_code,
		subcategory: null, // Could be extracted from tags if needed
		difficulty_level: parsedQuestion.difficulty,
		tags: parsedQuestion.tags,
		source: "Series 65 Practice Exam",
	}
}

// Function to import questions from a JSON file
async function importQuestionsFromFile(filePath) {
	console.log(`\n📁 Importing questions from: ${path.basename(filePath)}`)

	try {
		// Read and parse the JSON file
		const fileContent = fs.readFileSync(filePath, "utf8")
		const questions = JSON.parse(fileContent)

		if (!Array.isArray(questions)) {
			console.error("❌ Invalid JSON format: expected array of questions")
			return { imported: 0, failed: 0 }
		}

		console.log(`📊 Found ${questions.length} questions to import`)

		let imported = 0
		let failed = 0

		// Process questions in batches to avoid overwhelming the database
		const batchSize = 10
		for (let i = 0; i < questions.length; i += batchSize) {
			const batch = questions.slice(i, i + batchSize)
			const batchToInsert = []

			// Convert each question to database format
			for (const question of batch) {
				try {
					const converted = convertQuestionFormat(question)
					if (converted) {
						batchToInsert.push(converted)
					} else {
						failed++
					}
				} catch (error) {
					console.warn(`⚠️  Failed to convert question: ${error.message}`)
					failed++
				}
			}

			// Insert batch into database
			if (batchToInsert.length > 0) {
				try {
					const { data, error } = await supabase
						.from("questions")
						.insert(batchToInsert)
						.select()

					if (error) {
						console.error(`❌ Database error: ${error.message}`)
						failed += batchToInsert.length
					} else {
						imported += data.length
						console.log(
							`✅ Imported batch ${Math.floor(i / batchSize) + 1}: ${
								data.length
							} questions`
						)
					}
				} catch (error) {
					console.error(`❌ Insert error: ${error.message}`)
					failed += batchToInsert.length
				}
			}

			// Small delay between batches
			if (i + batchSize < questions.length) {
				await new Promise((resolve) => setTimeout(resolve, 1000))
			}
		}

		return { imported, failed }
	} catch (error) {
		console.error(`❌ Error reading file ${filePath}: ${error.message}`)
		return { imported: 0, failed: 0 }
	}
}

// Function to get all JSON files to import
function getImportFiles() {
	const parsedDir = path.join(__dirname, "..", "dist", "parsed")
	const files = fs.readdirSync(parsedDir)

	// Filter for batch-processed files and sort by name
	return files
		.filter((file) => file.endsWith("-batch.json") || file.includes("gpt5"))
		.map((file) => path.join(parsedDir, file))
		.sort()
}

// Main import function
async function main() {
	console.log("🚀 Starting question import process...")

	// Check if we can connect to the database
	try {
		const { data, error } = await supabase
			.from("questions")
			.select("count", { count: "exact", head: true })

		if (error) {
			console.error(`❌ Database connection failed: ${error.message}`)
			process.exit(1)
		}

		console.log("✅ Database connection successful")
	} catch (error) {
		console.error(`❌ Database connection failed: ${error.message}`)
		process.exit(1)
	}

	// Get all files to import
	const importFiles = getImportFiles()
	console.log(`\n📋 Found ${importFiles.length} files to import:`)
	importFiles.forEach((file) => console.log(`  - ${path.basename(file)}`))

	let totalImported = 0
	let totalFailed = 0

	// Import each file
	for (const filePath of importFiles) {
		const result = await importQuestionsFromFile(filePath)
		totalImported += result.imported
		totalFailed += result.failed
	}

	// Final summary
	console.log("\n🎉 Import process complete!")
	console.log(`📊 Total questions imported: ${totalImported}`)
	console.log(`❌ Total questions failed: ${totalFailed}`)
	console.log(
		`📈 Success rate: ${(
			(totalImported / (totalImported + totalFailed)) *
			100
		).toFixed(1)}%`
	)

	// Show current database count
	try {
		const { count, error } = await supabase
			.from("questions")
			.select("*", { count: "exact", head: true })

		if (!error) {
			console.log(`\n🗄️  Database now contains ${count} total questions`)
		}
	} catch (error) {
		console.log("Could not retrieve final count")
	}
}

// Run the import if this script is executed directly
if (require.main === module) {
	main().catch((error) => {
		console.error("❌ Import failed:", error.message)
		process.exit(1)
	})
}

module.exports = { importQuestionsFromFile, convertQuestionFormat }
