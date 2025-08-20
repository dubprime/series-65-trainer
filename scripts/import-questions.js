// scripts/llm-extract.mjs
// LLM-assisted extractor for OCR'd Series 65 exams -> normalized JSON
// Requires: OPENAI_API_KEY in env
// Usage:
//   node scripts/llm-extract.mjs training-material/exam-1.txt
//   node scripts/llm-extract.mjs training-material   # processes all .txt/.md files in the folder

import fs from "fs";
import path from "path";
import process from "process";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in environment.");
  process.exit(1);
}

// Minimal fetch wrapper to avoid extra deps
async function openaiJson(prompt) {
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
      messages: prompt,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

function listFiles(input) {
  if (!fs.existsSync(input)) return [];
  const stat = fs.statSync(input);
  if (stat.isDirectory()) {
    return fs
      .readdirSync(input)
      .filter((f) => f.endsWith(".txt") || f.endsWith(".md"))
      .map((f) => path.join(input, f));
  }
  if (stat.isFile()) return [input];
  return [];
}

function splitIntoQuestionBlocks(text) {
  // Split on question numbers like "12." or "120." at line starts
  const blocks = text.replace(/\r/g, "").split(/\n(?=\d{1,3}\.\s)/g);
  // Filter blocks that look like they start with a number
  return blocks.filter((b) => /^\d{1,3}\.\s/.test(b.trim()));
}

const SYSTEM_PROMPT = {
  role: "system",
  content:
    "You are a meticulous Series 65 exam item extractor. You will convert noisy OCR text for one multiple-choice question into a normalized JSON object. You must strictly follow the JSON schema and never include extra keys. If information is missing or ambiguous in the OCR, infer conservatively and leave rationale empty rather than hallucinating.",
};

const SCHEMA_EXPLANATION = `Schema (single question):
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
- Exactly 4 choices with ids A–D.
- If the correct choice cannot be determined, set an empty array for "correct" and leave rationale empty.
- Choose module_code using best-effort classification.
- difficulty: 2 for straightforward recall, 3 for suitability or EXCEPT questions, 4 if math or multi-step reasoning.
- tags: 2–5 concise topic tags.`;

const FEW_SHOT = [
  {
    role: "user",
    content:
      "12. A corporate bond with a 6% coupon trades at a discount. Which is TRUE?\nA. Current yield is lower than nominal yield\nB. Yield to maturity is higher than nominal yield\nC. Nominal yield is higher than YTM\nD. Current yield equals YTM\nCorrect: B\nExplanation: Discount bonds have YTM > current yield > nominal yield.",
  },
  {
    role: "assistant",
    content: JSON.stringify(
      {
        module_code: "IVC",
        stem:
          "A corporate bond with a 6% coupon trades at a discount. Which statement is true?",
        choices: [
          { id: "A", text: "Current yield is lower than nominal yield" },
          { id: "B", text: "Yield to maturity is higher than nominal yield" },
          { id: "C", text: "Nominal yield is higher than yield to maturity" },
          { id: "D", text: "Current yield equals yield to maturity" },
        ],
        correct: ["B"],
        rationale:
          "When price < par, YTM > current yield > nominal (coupon).",
        difficulty: 2,
        tags: ["bonds", "yields"],
      },
      null,
      2
    ),
  },
];

async function extractFromBlock(block, fileName) {
  const prompt = [
    SYSTEM_PROMPT,
    ...FEW_SHOT,
    { role: "user", content: `${SCHEMA_EXPLANATION}\n\nOCR Block from ${fileName}:\n"""\n${block}\n"""\nReturn a JSON object only.` },
  ];
  const obj = await openaiJson(prompt);
  return obj;
}

function validateShape(q) {
  if (!q) return false;
  if (!q.module_code || !q.stem || !Array.isArray(q.choices) || q.choices.length !== 4) return false;
  if (!Array.isArray(q.correct)) return false;
  const ids = q.choices.map((c) => c.id);
  if (!ids.includes("A") || !ids.includes("B") || !ids.includes("C") || !ids.includes("D")) return false;
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error("Usage: node scripts/llm-extract.mjs <file-or-dir>");
    process.exit(1);
  }

  const inputs = args
    .flatMap((p) => listFiles(p))
    .filter((p) => p);
  if (!inputs.length) {
    console.error("No .txt or .md inputs found.");
    process.exit(1);
  }

  const all = [];
  for (const file of inputs) {
    const raw = fs.readFileSync(file, "utf8");
    const blocks = splitIntoQuestionBlocks(raw);
    for (const b of blocks) {
      try {
        const obj = await extractFromBlock(b, path.basename(file));
        if (validateShape(obj)) all.push(obj);
        else {
          console.warn("Validation failed, skipping block from", file);
        }
      } catch (e) {
        console.warn("LLM failed on a block from", file, String(e.message || e));
      }
    }
  }

  if (!fs.existsSync("dist")) fs.mkdirSync("dist", { recursive: true });
  const outPath = path.join("dist", "questions_parsed.json");
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
  console.log(`Wrote ${all.length} items -> ${outPath}`);
}

main();

// scripts/parse_exams.mjs
// Fallback lightweight parser (no LLM) to extract well-formed items into dist/questions_parsed.json
// Use when you trust the OCR quality. Otherwise prefer scripts/llm-extract.mjs

import fs from "fs";
import path from "path";

const INPUT_DIR = process.argv[2] || "training-material";
const OUTPUT_DIR = "dist";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "questions_parsed.json");

function listFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".txt") || f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

function parseOneFile(text) {
  const blocks = text.replace(/\r/g, "").split(/\n(?=\d{1,3}\.\s)/g);
  const out = [];
  for (const raw of blocks) {
    const lines = raw.trim().split("\n");
    if (!/^\d{1,3}\.\s/.test(lines[0] || "")) continue;
    const stemLines = [];
    const choices = [];
    let correct = null;
    let rationale = "";
    let phase = "stem";
    for (let i = 1; i < lines.length; i++) {
      const L = lines[i].trim();
      if (/^[ABCD]\.\s?/.test(L)) {
        phase = "choices";
        choices.push({ id: L[0], text: L.replace(/^[ABCD]\.\s?/, "").trim() });
        continue;
      }
      if (/^Correct\s*:\s*([ABCD])\b/i.test(L)) {
        correct = (L.match(/^Correct\s*:\s*([ABCD])\b/i) || [])[1];
        continue;
      }
      if (/^Explanation\s*:/i.test(L)) {
        phase = "explanation";
        rationale += L.replace(/^Explanation\s*:\s*/i, "");
        continue;
      }
      if (phase === "stem") stemLines.push(L);
      else if (phase === "choices") {
        if (L && !/^[ABCD]\.\s?/.test(L) && !/^Correct\s*:/.test(L)) {
          choices[choices.length - 1].text += " " + L;
        }
      } else rationale += (rationale ? " " : "") + L;
    }
    if (choices.length === 4 && correct) {
      out.push({
        module_code: "CIRS", // default, will be re-tagged later if needed
        stem: stemLines.join(" ").replace(/\s+/g, " ").trim(),
        choices,
        correct: [correct],
        rationale: rationale.trim(),
        difficulty: 2,
        tags: ["auto"],
      });
    }
  }
  return out;
}

function run() {
  const files = listFiles(INPUT_DIR);
  const all = [];
  for (const f of files) {
    const txt = fs.readFileSync(f, "utf8");
    all.push(...parseOneFile(txt));
  }
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(all, null, 2));
  console.log(`Parsed ${all.length} questions -> ${OUTPUT_FILE}`);
}

run();

// scripts/validate-parsed.mjs
import fs from "fs";

const INPUT = process.argv[2] || "dist/questions_parsed.json";

const required = ["module_code", "stem", "choices", "correct", "difficulty", "tags"];

function validate(q) {
  for (const k of required) if (!(k in q)) return false;
  if (!Array.isArray(q.choices) || q.choices.length !== 4) return false;
  const ids = q.choices.map((c) => c.id);
  if (!["A","B","C","D"].every((x) => ids.includes(x))) return false;
  if (!Array.isArray(q.correct)) return false;
  return true;
}

function run() {
  const raw = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  let ok = 0, bad = 0;
  raw.forEach((q, i) => {
    if (validate(q)) ok++; else {
      bad++;
      console.error(`Invalid at index ${i}:`, q && q.stem ? q.stem.slice(0,120) : q);
    }
  });
  console.log(`Valid: ${ok}, Invalid: ${bad}`);
  process.exit(bad ? 1 : 0);
}

run();
