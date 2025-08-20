/**
 * scripts/parse-exams.js
 * LLM-assisted parser for OCR-cleaned Series 65 practice exams (CommonJS, Node 18+).
 *
 * Input: cleaned .txt or .md files (run scripts/ocr-clean.js first)
 * Env:   OPENAI_API_KEY must be set. If missing, this script will try to read .env.local in repo root.
 * Usage:
 *   node scripts/parse-exams.js training-material/clean/exam-1.txt
 *   node scripts/parse-exams.js training-material/clean
 *
 * Output:
 *   - dist/parsed/<basename>.json (normalized array for each input)
 *   - dist/questions_parsed.json (merged across all inputs)
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

function toInputs(p) {
	const abs = path.resolve(process.cwd(), p)
	if (!fs.existsSync(abs)) return []
	const st = fs.statSync(abs)
	if (st.isDirectory()) {
		return fs
			.readdirSync(abs)
			.filter((f) => f.endsWith(".txt") || f.endsWith(".md"))
			.map((f) => path.join(abs, f))
	}
	if (st.isFile()) return [abs]
	return []
}

function splitBlocks(text) {
	return text
		.replace(/\r/g, "")
		.split(/\n(?=\d{1,3}\.\s)/g)
		.filter((b) => /^\d{1,3}\.\s/.test(b.trim()))
}

const SYSTEM = {
	role: "system",
	content:
		"You are a meticulous Series 65 exam item extractor. Convert cleaned OCR for one multiple-choice question into normalized JSON that fits the schema exactly. Do not include extra keys. If the correct answer cannot be determined, return an empty correct array and empty rationale.",
}

const SCHEMA = `Schema for a single question (exact keys):
{
  "module_code": "EFBI" | "IVC" | "CIRS" | "LRG",
  "stem": string,
  "choices": [{"id":"A","text":string},{"id":"B","text":string},{"id":"C","text":string},{"id":"D","text":string}],
  "correct": ["A"|"B"|"C"|"D"],
  "rationale": string,
  "difficulty": 1|2|3|4|5,
  "tags": string[]
}
Rules:
- Exactly 4 choices A-D.
- If the correct answer is not clearly indicated, use an empty array for correct and empty rationale.
- Choose module_code by best-effort classification.
- difficulty: 2 for recall, 3 for suitability or EXCEPT questions, 4 for math or multi-step.
- 2–5 concise tags.`

const FEW_SHOT = [
	{
		role: "user",
		content:
			"7. A corporate bond with a 6% coupon trades at a discount. Which is TRUE?\nA. Current yield is lower than nominal yield\nB. Yield to maturity is higher than nominal yield\nC. Nominal yield is higher than YTM\nD. Current yield equals YTM\nCorrect: B\nExplanation: Discount bonds have YTM > current yield > nominal yield.",
	},
	{
		role: "assistant",
		content: JSON.stringify(
			{
				module_code: "IVC",
				stem: "A corporate bond with a 6% coupon trades at a discount. Which statement is true?",
				choices: [
					{ id: "A", text: "Current yield is lower than nominal yield" },
					{ id: "B", text: "Yield to maturity is higher than nominal yield" },
					{ id: "C", text: "Nominal yield is higher than yield to maturity" },
					{ id: "D", text: "Current yield equals yield to maturity" },
				],
				correct: ["B"],
				rationale:
					"Price < par implies YTM > current yield > nominal (coupon).",
				difficulty: 2,
				tags: ["bonds", "yields"],
			},
			null,
			2
		),
	},
]

async function openaiJson(messages) {
	const res = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "gpt-4o-mini",
			temperature: 0.2,
			response_format: { type: "json_object" },
			messages,
		}),
	})
	if (!res.ok) {
		const body = await res.text()
		throw new Error(`OpenAI ${res.status}: ${body}`)
	}
	const data = await res.json()
	const content = data?.choices?.[0]?.message?.content || "{}"
	try {
		return JSON.parse(content)
	} catch (e) {
		return {}
	}
}

function validateOne(q) {
	if (!q) return false
	if (
		!q.module_code ||
		!q.stem ||
		!Array.isArray(q.choices) ||
		q.choices.length !== 4
	)
		return false
	const ids = q.choices.map((c) => c && c.id)
	if (
		!ids.includes("A") ||
		!ids.includes("B") ||
		!ids.includes("C") ||
		!ids.includes("D")
	)
		return false
	if (!Array.isArray(q.correct)) return false
	if (typeof q.difficulty !== "number") return false
	if (!Array.isArray(q.tags)) return false
	return true
}

async function parseOneFile(file) {
	const raw = fs.readFileSync(file, "utf8")
	const blocks = splitBlocks(raw)
	const out = []
	let idx = 0
	for (const block of blocks) {
		idx++
		try {
			const prompt = [
				SYSTEM,
				...FEW_SHOT,
				{
					role: "user",
					content: `${SCHEMA}\n\nOCR Block from ${path.basename(
						file
					)}:\n"""\n${block}\n"""\nReturn only the JSON object.`,
				},
			]
			const obj = await openaiJson(prompt)
			if (validateOne(obj)) out.push(obj)
			else
				console.warn(
					`Validation failed for block #${idx} in ${path.basename(file)}`
				)
		} catch (e) {
			console.warn(
				`LLM error for block #${idx} in ${path.basename(file)}:`,
				String(e.message || e)
			)
		}
	}
	return out
}

async function main() {
	const target = process.argv[2]
	if (!target) {
		console.error("Usage: node scripts/parse-exams.js <file-or-dir>")
		process.exit(1)
	}

	const inputs = toInputs(target)
	if (!inputs.length) {
		console.error(
			`No .txt or .md inputs found at: ${path.resolve(process.cwd(), target)}`
		)
		process.exit(1)
	}

	const merged = []
	const outDir = path.join(process.cwd(), "dist", "parsed")
	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

	for (const file of inputs) {
		console.log(`Parsing with LLM: ${file}`)
		const arr = await parseOneFile(file)
		const outPath = path.join(
			outDir,
			path.basename(file).replace(/\.(txt|md)$/i, ".json")
		)
		fs.writeFileSync(outPath, JSON.stringify(arr, null, 2))
		console.log(`  Wrote ${arr.length} items -> ${outPath}`)
		merged.push(...arr)
	}

	const mergedPath = path.join(process.cwd(), "dist", "questions_parsed.json")
	fs.writeFileSync(mergedPath, JSON.stringify(merged, null, 2))
	console.log(`Merged total ${merged.length} -> ${mergedPath}`)
}

main()
