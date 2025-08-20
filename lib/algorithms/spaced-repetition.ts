export interface QuestionPriority {
	questionId: string
	priority: number
	reason: string
	lastAttempted?: Date
	attempts: number
	correctAttempts: number
	accuracy: number
	difficulty: number
}

export interface SpacedRepetitionConfig {
	baseInterval: number // Base interval in days
	correctMultiplier: number // Multiplier for correct answers
	incorrectMultiplier: number // Multiplier for incorrect answers
	maxInterval: number // Maximum interval in days
	minInterval: number // Minimum interval in days
}

export class SpacedRepetitionAlgorithm {
	private config: SpacedRepetitionConfig

	constructor(config?: Partial<SpacedRepetitionConfig>) {
		this.config = {
			baseInterval: 1,
			correctMultiplier: 2.5,
			incorrectMultiplier: 0.5,
			maxInterval: 30,
			minInterval: 0.5,
			...config,
		}
	}

	/**
	 * Calculate the next review interval for a question based on performance
	 */
	calculateNextInterval(
		attempts: number,
		correctAttempts: number,
		lastAttempted: Date,
		difficulty: number
	): number {
		const accuracy = attempts > 0 ? correctAttempts / attempts : 0
		const baseInterval = this.config.baseInterval * (difficulty / 2) // Adjust for difficulty

		let interval: number

		if (accuracy >= 0.8) {
			// High accuracy: increase interval
			interval = baseInterval * Math.pow(this.config.correctMultiplier, attempts)
		} else if (accuracy >= 0.6) {
			// Medium accuracy: moderate increase
			interval = baseInterval * Math.pow(1.5, attempts)
		} else {
			// Low accuracy: decrease interval for more frequent review
			interval = baseInterval * Math.pow(this.config.incorrectMultiplier, attempts)
		}

		// Apply bounds
		interval = Math.max(this.config.minInterval, Math.min(this.config.maxInterval, interval))

		return interval
	}

	/**
	 * Calculate priority score for question scheduling
	 */
	calculatePriority(
		questionId: string,
		attempts: number,
		correctAttempts: number,
		lastAttempted: Date,
		difficulty: number,
		category: string
	): QuestionPriority {
		const accuracy = attempts > 0 ? correctAttempts / attempts : 0
		const daysSinceLastAttempt = this.getDaysSince(lastAttempted)
		const nextInterval = this.calculateNextInterval(attempts, correctAttempts, lastAttempted, difficulty)

		// Priority factors
		const urgencyFactor = Math.max(0, daysSinceLastAttempt - nextInterval) / 10
		const difficultyFactor = difficulty / 5 // Normalize difficulty 1-5
		const accuracyFactor = 1 - accuracy // Lower accuracy = higher priority
		const attemptFactor = Math.max(0, 3 - attempts) / 3 // New questions get priority

		// Calculate overall priority
		let priority = 0
		priority += urgencyFactor * 3 // Urgency is most important
		priority += accuracyFactor * 2 // Accuracy is second most important
		priority += attemptFactor * 1.5 // New questions get some priority
		priority += difficultyFactor * 0.5 // Difficulty has minimal impact

		// Determine reason for priority
		let reason = ""
		if (daysSinceLastAttempt > nextInterval) {
			reason = `Due for review (${Math.floor(daysSinceLastAttempt)} days overdue)`
		} else if (accuracy < 0.5) {
			reason = "Low accuracy - needs practice"
		} else if (attempts === 0) {
			reason = "New question - first attempt"
		} else if (accuracy < 0.8) {
			reason = "Moderate accuracy - could improve"
		} else {
			reason = "Good performance - maintenance review"
		}

		return {
			questionId,
			priority,
			reason,
			lastAttempted,
			attempts,
			correctAttempts,
			accuracy,
			difficulty,
		}
	}

	/**
	 * Get prioritized question list for a study session
	 */
	getPrioritizedQuestions(
		questions: Array<{
			id: string
			difficulty_level: number
			category: string
		}>,
		userProgress: Record<string, {
			attempts: number
			correctAttempts: number
			lastAttempted: Date
		}>,
		sessionSize: number = 5
	): QuestionPriority[] {
		const priorities: QuestionPriority[] = []

		questions.forEach((question) => {
			const progress = userProgress[question.id] || {
				attempts: 0,
				correctAttempts: 0,
				lastAttempted: new Date(0), // Never attempted
			}

			const priority = this.calculatePriority(
				question.id,
				progress.attempts,
				progress.correctAttempts,
				progress.lastAttempted,
				question.difficulty_level,
				question.category
			)

			priorities.push(priority)
		})

		// Sort by priority (highest first) and return top questions
		return priorities
			.sort((a, b) => b.priority - a.priority)
			.slice(0, sessionSize)
	}

	/**
	 * Get questions for focused practice on weak areas
	 */
	getWeakAreaQuestions(
		questions: Array<{
			id: string
			difficulty_level: number
			category: string
		}>,
		userProgress: Record<string, {
			attempts: number
			correctAttempts: number
			lastAttempted: Date
		}>,
		category: string,
		sessionSize: number = 5
	): QuestionPriority[] {
		const categoryQuestions = questions.filter(q => q.category === category)
		const priorities = this.getPrioritizedQuestions(categoryQuestions, userProgress, sessionSize)
		
		// Filter to only include questions with low accuracy
		return priorities.filter(q => q.accuracy < 0.7)
	}

	/**
	 * Get questions for mixed difficulty practice
	 */
	getMixedDifficultyQuestions(
		questions: Array<{
			id: string
			difficulty_level: number
			category: string
		}>,
		userProgress: Record<string, {
			attempts: number
			correctAttempts: number
			lastAttempted: Date
		}>,
		sessionSize: number = 5
	): QuestionPriority[] {
		const priorities = this.getPrioritizedQuestions(questions, userProgress, sessionSize * 2)
		
		// Ensure mix of difficulties
		const easy = priorities.filter(q => q.difficulty <= 2).slice(0, Math.ceil(sessionSize * 0.3))
		const medium = priorities.filter(q => q.difficulty === 3).slice(0, Math.ceil(sessionSize * 0.4))
		const hard = priorities.filter(q => q.difficulty >= 4).slice(0, Math.ceil(sessionSize * 0.3))

		return [...easy, ...medium, ...hard].slice(0, sessionSize)
	}

	private getDaysSince(date: Date): number {
		const now = new Date()
		const diffTime = Math.abs(now.getTime() - date.getTime())
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	}
}

// Default configuration
export const defaultSpacedRepetition = new SpacedRepetitionAlgorithm()
