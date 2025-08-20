/**
 * scripts/parse-exam.js
 * LLM-assisted parser for OCR-cleaned Series 65 practice exams.
 *
 * Input: cleaned .txt or .md files (recommend running scripts/ocr-clean.js first)
 * Env:   OPENAI_API_KEY must be set in .env.local or your shell
 * Usage:
 *   node scripts/parse-exam.js training-material/clean/exam-1.txt
 *   node scripts/parse-exam.js training-material/clean
 *
 * Output:
 *   - dist/parsed/<basename>.json (normalized array for each input)
 *   - dist/questions_parsed.json (merged across all inputs)
 */

import fs from "fs";
import path from "path";
import process from "process";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY. Add it to .env.local or export it in your shell.");
  process.exit(1);
}

/**
 * Helper: read files or directory of files
 */
function listInputs(p) {
  if (!fs.existsSync(p)) return [];
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    return fs
      .readdirSync(p)
      .filter((f) => f.endsWith(".txt") || f.endsWith(".md"))
      .map((f) => path.join(p, f));
  }
  if (st.isFile()) return [p];
  return [];
}

/**
 * Split cleaned text into question blocks.
 * We expect numbering like "12." or "120." at line start.
 */
function splitBlocks(text) {
  return text.replace(/\r/g, "").split(/\n(?=\d{1,3}\.\s)/g).filter((b) => /^\d{1,3}\.\s/.test(b.trim()));
}

const SYSTEM = {
  role: "system",
  content:
    "You are a meticulous Series 65 exam item extractor. Convert noisy but cleaned OCR for one multiple-choice question into normalized JSON that fits the schema exactly. Do not include extra keys. If the correct answer cannot be determined, return an empty correct array and empty rationale.",
};

const SCHEMA = `Schema for a single question (exact keys):\n{\n  "module_code": "EFBI" | "IVC" | "CIRS" | "LRG",\n  "stem": string,\n  "choices": [{"id":"A","text":string},{"id":"B","text":string},{"id":"C","text":string},{"id":"D","text":string}],\n  "correct": ["A"|"B"|"C"|"D"],\n  "rationale": string,\n  "difficulty": 1|2|3|4|5,\n  "tags": string[]\n}\nRules:\n- Exactly 4 choices A-D.\n- If the correct answer is not clearly indicated, use an empty array for correct and empty rationale.\n- Choose module_code by best-effort classification.\n- difficulty: 2 for recall, 3 for suitability or EXCEPT questions, 4 for math or multi-step.\n- 2–5 concise tags.`;

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
        rationale: "Price < par implies YTM > current yield > nominal (coupon).",
        difficulty: 2,
        tags: ["bonds", "yields"],
      },
      null,
      2
    ),
  },
];

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
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI ${res.status}: ${body}`);
  }
  const data = await res.json();
  return JSON.parse(data.choices?.[0]?.message?.content || "{}");
}

function validateOne(q) {
  if (!q) return false;
  if (!q.module_code || !q.stem || !Array.isArray(q.choices) || q.choices.length !== 4) return false;
  const ids = q.choices.map((c) => c?.id);
  if (!ids.includes("A") || !ids.includes("B") || !ids.includes("C") || !ids.includes("D")) return false;
  if (!Array.isArray(q.correct)) return false;
  if (typeof q.difficulty !== "number") return false;
  if (!Array.isArray(q.tags)) return false;
  return true;
}

async function parseOneFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  const blocks = splitBlocks(raw);
  const out = [];
  let idx = 0;
  for (const block of blocks) {
    idx++;
    try {
      const prompt = [
        SYSTEM,
        ...FEW_SHOT,
        {
          role: "user",
          content: `${SCHEMA}\n\nOCR Block from ${path.basename(file)}:\n"""\n${block}\n"""\nReturn only the JSON object.`,
        },
      ];
      const obj = await openaiJson(prompt);
      if (validateOne(obj)) out.push(obj);
      else console.warn(`Validation failed for block #${idx} in ${path.basename(file)}`);
    } catch (e) {
      console.warn(`LLM error for block #${idx} in ${path.basename(file)}:`, String(e.message || e));
    }
  }
  return out;
}

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: node scripts/parse-exam.js <file-or-dir>");
    process.exit(1);
  }

  const inputs = listInputs(target);
  if (!inputs.length) {
    console.error("No .txt or .md inputs found.");
    process.exit(1);
  }

  const merged = [];
  const outDir = path.join("dist", "parsed");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const file of inputs) {
    console.log(`Parsing with LLM: ${file}`);
    const arr = await parseOneFile(file);
    const outPath = path.join(outDir, path.basename(file).replace(/\.(txt|md)$/i, ".json"));
    fs.writeFileSync(outPath, JSON.stringify(arr, null, 2));
    console.log(`  Wrote ${arr.length} items -> ${outPath}`);
    merged.push(...arr);
  }

  const mergedPath = path.join("dist", "questions_parsed.json");
  fs.writeFileSync(mergedPath, JSON.stringify(merged, null, 2));
  console.log(`Merged total ${merged.length} -> ${mergedPath}`);
}

main();
