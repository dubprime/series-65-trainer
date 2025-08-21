#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load environment variables
config({ path: '.env.production' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing Supabase credentials in .env.production')
	console.log('Please ensure you have:')
	console.log('- NEXT_PUBLIC_SUPABASE_URL')
	console.log('- SUPABASE_SERVICE_ROLE_KEY')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function importQuestions() {
	try {
		console.log('🚀 Starting question import to production...')
		
		// Check if questions already exist
		const { count, error: countError } = await supabase
			.from('questions')
			.select('*', { count: 'exact', head: true })
		
		if (countError) {
			console.error('❌ Error checking questions:', countError)
			return
		}
		
		if (count && count > 0) {
			console.log(`✅ Questions already exist (${count} records)`)
			return
		}
		
		// Look for parsed question files
		const parsedDir = path.join(process.cwd(), 'dist', 'parsed')
		if (!fs.existsSync(parsedDir)) {
			console.log('📁 Creating parsed directory...')
			fs.mkdirSync(parsedDir, { recursive: true })
		}
		
		const files = fs.readdirSync(parsedDir)
		const jsonFiles = files.filter(file => 
			file.endsWith('.json') && 
			(file.includes('batch') || file.includes('gpt5'))
		)
		
		if (jsonFiles.length === 0) {
			console.log('📁 No parsed question files found in dist/parsed/')
			console.log('Please run the parsing scripts first:')
			console.log('1. pnpm run parse:exams')
			console.log('2. pnpm run import:questions')
			return
		}
		
		console.log(`📚 Found ${jsonFiles.length} question files to import`)
		
		let totalImported = 0
		
		for (const file of jsonFiles) {
			console.log(`📖 Processing ${file}...`)
			
			const filePath = path.join(parsedDir, file)
			const content = fs.readFileSync(filePath, 'utf8')
			const questions = JSON.parse(content)
			
			if (!Array.isArray(questions)) {
				console.log(`⚠️  Skipping ${file} - not an array`)
				continue
			}
			
			// Convert to database format
			const dbQuestions = questions.map(q => ({
				question_text: q.question,
				choices: q.choices,
				correct_answer: q.correct_answer,
				explanation: q.explanation || null,
				difficulty_level: q.difficulty || 'medium',
				category: q.category || 'General',
				tags: q.tags || []
			}))
			
			// Insert in batches
			const batchSize = 50
			for (let i = 0; i < dbQuestions.length; i += batchSize) {
				const batch = dbQuestions.slice(i, i + batchSize)
				
				const { error } = await supabase
					.from('questions')
					.insert(batch)
				
				if (error) {
					console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error)
					continue
				}
				
				console.log(`✅ Imported batch ${i / batchSize + 1} (${batch.length} questions)`)
				totalImported += batch.length
				
				// Small delay to avoid overwhelming the API
				await new Promise(resolve => setTimeout(resolve, 100))
			}
		}
		
		console.log(`🎉 Import complete! Total questions imported: ${totalImported}`)
		
	} catch (error) {
		console.error('❌ Import failed:', error)
		process.exit(1)
	}
}

// Run the import
importQuestions()
