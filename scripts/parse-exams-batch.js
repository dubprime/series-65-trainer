/**
 * scripts/parse-exams-batch.js
 * Batch processor for OCR-cleaned Series 65 practice exams with rate limiting.
 * 
 * This script processes questions in small batches with delays to avoid rate limits.
 * It also includes OCR cleanup for better text quality.
 */

const fs = require("fs")
const path = require("path")
const process = require("process")

// Load OPENAI_API_KEY from .env.local if not already present
;(function ensureEnv() {
	if (process.env.OPENAI_API_KEY) return
	const envPath = path.join(process.cwd(), ".env.local")
	if (fs.existsSync(envPath)) {
		const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/)
		for (const line of lines) {
			const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
			if (!m) continue
			const k = m[1]
			let v = m[2]
			if (
				(v.startsWith('"') && v.endsWith('"')) ||
				(v.startsWith("'") && v.endsWith("'"))
			)
				v = v.slice(1, -1)
			if (!process.env[k]) process.env[k] = v
		}
	}
})()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
	console.error(
		"Missing OPENAI_API_KEY. Add it to .env.local or export it in your shell."
	)
	process.exit(1)
}

// Configuration
const BATCH_SIZE = 5 // Process 5 questions at a time
const DELAY_BETWEEN_BATCHES = 25000 // 25 seconds between batches (to stay under 3 RPM limit)
const MAX_RETRIES = 3

// OCR cleanup function
function cleanOCRText(text) {
	return text
		.replace(/\r/g, "")
		.replace(/\n{3,}/g, "\n\n") // Remove excessive newlines
		.replace(/[^\x00-\x7F]/g, "") // Remove non-ASCII characters
		.replace(/\s+/g, " ") // Normalize whitespace
		.trim()
}

// Split text into question blocks
function splitBlocks(text) {
	return text
		.replace(/\r/g, "")
		.split(/\n(?=\d{1,3}\.\s)/g)
		.filter((b) => /^\d{1,3}\.\s/.test(b.trim()))
		.map(cleanOCRText)
}

// Process a single question with OpenAI
async function processQuestion(questionText, questionNumber) {
	const systemPrompt = {
		role: "system",
		content: `You are a meticulous Series 65 exam item extractor. Convert this cleaned OCR text into normalized JSON that fits the schema exactly. 

If the text is unclear or incomplete, return null. Focus on quality over quantity.

Schema:
{
  "module_code": "EFBI" | "IVC" | "CIRS" | "LRG",
  "stem": "clear question text",
  "choices": [{"id":"A","text":"choice text"},{"id":"B","text":"choice text"},{"id":"C","text":"choice text"},{"id":"D","text":"choice text"}],
  "correct": ["A"|"B"|"C"|"D"],
  "rationale": "explanation",
  "difficulty": 1|2|3|4|5,
  "tags": ["tag1", "tag2", "tag3"]
}

Rules:
- Exactly 4 choices A-D
- If unclear, return null
- module_code: EFBI=Ethics, IVC=Investment Vehicles, CIRS=Customer Investment, LRG=Legal/Regulatory
- difficulty: 1=easy, 2=basic, 3=moderate, 4=hard, 5=expert
- 2-5 concise tags`
	}

	const userPrompt = {
		role: "user",
		content: `Question ${questionNumber}:\n${questionText}`
	}

	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${OPENAI_API_KEY}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "gpt-4o-mini",
				messages: [systemPrompt, userPrompt],
				temperature: 0.1,
				max_tokens: 1000
			})
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
		}

		const data = await response.json()
		const content = data.choices[0]?.message?.content

		if (!content) {
			throw new Error("No content in response")
		}

		// Try to extract JSON from the response
		const jsonMatch = content.match(/\{[\s\S]*\}/)
		if (!jsonMatch) {
			return null
		}

		const parsed = JSON.parse(jsonMatch[0])
		
		// Validate the parsed question
		if (!parsed.stem || !parsed.choices || parsed.choices.length !== 4) {
			return null
		}

		return parsed
	} catch (error) {
		console.error(`Error processing question ${questionNumber}:`, error.message)
		return null
	}
}

// Process questions in batches
async function processBatch(questions, startIndex) {
	const batch = questions.slice(startIndex, startIndex + BATCH_SIZE)
	const results = []
	
	console.log(`Processing batch ${Math.floor(startIndex / BATCH_SIZE) + 1}: questions ${startIndex + 1}-${Math.min(startIndex + BATCH_SIZE, questions.length)}`)
	
	for (let i = 0; i < batch.length; i++) {
		const questionNumber = startIndex + i + 1
		const result = await processQuestion(batch[i], questionNumber)
		if (result) {
			results.push(result)
			console.log(`✓ Question ${questionNumber} processed successfully`)
		} else {
			console.log(`✗ Question ${questionNumber} failed or was unclear`)
		}
		
		// Small delay between individual questions
		if (i < batch.length - 1) {
			await new Promise(resolve => setTimeout(resolve, 2000))
		}
	}
	
	return results
}

// Main processing function
async function processFile(filePath) {
	console.log(`\n🚀 Starting batch processing of: ${path.basename(filePath)}`)
	
	// Read and clean the file
	const content = fs.readFileSync(filePath, "utf8")
	const questions = splitBlocks(content)
	
	console.log(`📊 Found ${questions.length} question blocks`)
	
	if (questions.length === 0) {
		console.log("❌ No questions found in file")
		return
	}
	
	// Process in batches
	const allResults = []
	const totalBatches = Math.ceil(questions.length / BATCH_SIZE)
	
	for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
		const startIndex = batchIndex * BATCH_SIZE
		const batchResults = await processBatch(questions, startIndex)
		allResults.push(...batchResults)
		
		console.log(`✅ Batch ${batchIndex + 1}/${totalBatches} complete: ${batchResults.length} questions processed`)
		
		// Delay between batches (except for the last batch)
		if (batchIndex < totalBatches - 1) {
			console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000} seconds before next batch...`)
			await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
		}
	}
	
	// Save results
	const outputPath = path.join("dist", "parsed", `${path.basename(filePath, ".txt")}-batch.json`)
	fs.mkdirSync(path.dirname(outputPath), { recursive: true })
	fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2))
	
	console.log(`\n🎉 Processing complete!`)
	console.log(`📁 Output saved to: ${outputPath}`)
	console.log(`📊 Total questions processed: ${allResults.length}/${questions.length}`)
	console.log(`📈 Success rate: ${((allResults.length / questions.length) * 100).toFixed(1)}%`)
	
	return allResults
}

// Main execution
async function main() {
	const args = process.argv.slice(2)
	
	if (args.length === 0) {
		console.log("Usage: node scripts/parse-exams-batch.js <file-path>")
		console.log("Example: node scripts/parse-exams-batch.js training-material/exam-1.txt")
		process.exit(1)
	}
	
	const filePath = args[0]
	
	if (!fs.existsSync(filePath)) {
		console.error(`❌ File not found: ${filePath}`)
		process.exit(1)
	}
	
	try {
		await processFile(filePath)
	} catch (error) {
		console.error("❌ Processing failed:", error.message)
		process.exit(1)
	}
}

if (require.main === module) {
	main()
}

module.exports = { processFile, cleanOCRText }
