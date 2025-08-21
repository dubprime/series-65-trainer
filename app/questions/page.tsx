"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Question {
	id: string
	question_text: string
	question_type: string
	choices: Array<{ text: string; is_correct: boolean }>
	correct_answer: string
	explanation: string
	category: string
	difficulty_level: number
	tags: string[]
	source: string
}

interface UserAnswer {
	question_id: string
	selected_answer: string
	is_correct: boolean
	answered_at: Date
	submitted: boolean
}

function QuestionsContent() {
	const [questions, setQuestions] = useState<Question[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({})
	const [showExplanations, setShowExplanations] = useState<
		Record<string, boolean>
	>({})
	const [submitting, setSubmitting] = useState<Record<string, boolean>>({})
	const [sessionStartTime] = useState<Date>(new Date())
	const [sessionTime, setSessionTime] = useState<number>(0)
	const questionsPerPage = 5

	// Filter states
	const [showFilters, setShowFilters] = useState(false)
	const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
	const [selectedCategory, setSelectedCategory] = useState<string>("all")
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [availableCategories, setAvailableCategories] = useState<string[]>([])
	const [availableTags, setAvailableTags] = useState<string[]>([])
	const [availableDifficulties, setAvailableDifficulties] = useState<number[]>(
		[]
	)

	useEffect(() => {
		fetchQuestions()
		fetchUserProgress()

		// Start session timer
		const timer = setInterval(() => {
			setSessionTime(
				Math.floor((Date.now() - sessionStartTime.getTime()) / 1000)
			)
		}, 1000)

		return () => clearInterval(timer)
	}, [sessionStartTime])

	// Apply filters when filter states change
	useEffect(() => {
		if (questions.length > 0) {
			applyFilters()
		}
	}, [selectedDifficulty, selectedCategory, selectedTags, questions])

	async function fetchQuestions() {
		try {
			const supabase = createClient()
			const { data, error } = await supabase
				.from("questions")
				.select("*")
				.order("id")

			if (error) {
				console.error("Error fetching questions:", error)
				return
			}

			const questionsData = data || []
			setQuestions(questionsData)

			// Extract available filter options
			const categories = [
				...new Set(questionsData.map((q) => q.category).filter(Boolean)),
			]
			const difficulties = [
				...new Set(
					questionsData.map((q) => q.difficulty_level).filter(Boolean)
				),
			]
			const allTags = questionsData.flatMap((q) => q.tags || []).filter(Boolean)
			const tags = [...new Set(allTags)]

			setAvailableCategories(categories)
			setAvailableDifficulties(difficulties)
			setAvailableTags(tags)

			// Initially set filtered questions to all questions
			setFilteredQuestions(questionsData)
		} catch (error) {
			console.error("Error:", error)
		} finally {
			setLoading(false)
		}
	}

	async function fetchUserProgress() {
		try {
			const supabase = createClient()
			const {
				data: { user },
			} = await supabase.auth.getUser()

			if (!user) return

			const { data: progress, error } = await supabase
				.from("user_progress")
				.select("*")
				.eq("user_id", user.id)

			if (error) {
				console.error("Error fetching progress:", error)
				return
			}

			// Convert progress data to UserAnswer format
			const answers: Record<string, UserAnswer> = {}
			progress?.forEach((p) => {
				answers[p.question_id] = {
					question_id: p.question_id,
					selected_answer: p.selected_answer,
					is_correct: p.is_correct,
					answered_at: new Date(p.last_attempted_at),
					submitted: p.submitted,
				}
			})

			setUserAnswers(answers)

			// Show explanations for previously answered questions
			const explanations: Record<string, boolean> = {}
			progress?.forEach((p) => {
				if (p.submitted) {
					explanations[p.question_id] = true
				}
			})
			setShowExplanations(explanations)
		} catch (error) {
			console.error("Error fetching user progress:", error)
		}
	}

	function applyFilters() {
		let filtered = questions

		// Filter by difficulty
		if (selectedDifficulty !== "all") {
			filtered = filtered.filter(
				(q) => q.difficulty_level.toString() === selectedDifficulty
			)
		}

		// Filter by category
		if (selectedCategory !== "all") {
			filtered = filtered.filter((q) => q.category === selectedCategory)
		}

		// Filter by tags
		if (selectedTags.length > 0) {
			filtered = filtered.filter(
				(q) => q.tags && q.tags.some((tag) => selectedTags.includes(tag))
			)
		}

		setFilteredQuestions(filtered)
		setCurrentPage(1) // Reset to first page when filtering
	}

	function clearFilters() {
		setSelectedDifficulty("all")
		setSelectedCategory("all")
		setSelectedTags([])
		setFilteredQuestions(questions)
		setCurrentPage(1)
	}

	function toggleTag(tag: string) {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		)
	}

	async function submitAnswer(questionId: string) {
		if (!userAnswers[questionId]?.selected_answer) return

		console.log("Submitting answer:", {
			questionId,
			selectedAnswer: userAnswers[questionId].selected_answer,
		})
		setSubmitting((prev) => ({ ...prev, [questionId]: true }))

		try {
			const supabase = createClient()
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) return

			const question = questions.find((q) => q.id === questionId)
			if (!question) return

			const choiceIndex = parseInt(userAnswers[questionId].selected_answer)
			const selectedChoice = question.choices[choiceIndex]
			if (!selectedChoice) return

			const isCorrect = selectedChoice.is_correct

			// Get existing progress to update attempts
			const { data: existingProgress } = await supabase
				.from("user_progress")
				.select("attempts, correct_attempts")
				.eq("user_id", user.id)
				.eq("question_id", questionId)
				.single()

			const currentAttempts = existingProgress?.attempts || 0
			const currentCorrectAttempts = existingProgress?.correct_attempts || 0

			const userAnswer: UserAnswer = {
				question_id: questionId,
				selected_answer: userAnswers[questionId].selected_answer,
				is_correct: isCorrect,
				answered_at: new Date(),
				submitted: true,
			}

			// Update local state
			setUserAnswers((prev) => ({
				...prev,
				[questionId]: userAnswer,
			}))

			// Show explanation
			setShowExplanations((prev) => ({
				...prev,
				[questionId]: true,
			}))

			// Save to database with attempt tracking
			const { error: upsertError } = await supabase
				.from("user_progress")
				.upsert({
					user_id: user.id,
					question_id: questionId,
					selected_answer: userAnswer.selected_answer,
					is_correct: isCorrect,
					last_attempted_at: userAnswer.answered_at.toISOString(),
					submitted: true,
					attempts: currentAttempts + 1,
					correct_attempts: currentCorrectAttempts + (isCorrect ? 1 : 0),
				})

			if (upsertError) {
				console.error("Error saving answer:", upsertError)
				alert("Error saving answer. Please try again.")
			}
		} catch (error) {
			console.error("Error saving answer:", error)
			alert("Error saving answer. Please try again.")
		} finally {
			setSubmitting((prev) => ({ ...prev, [questionId]: false }))
		}
	}

	function getAnswerStatus(questionId: string) {
		const answer = userAnswers[questionId]
		if (!answer) return "unanswered"
		return answer.is_correct ? "correct" : "incorrect"
	}

	function getChoiceStyle(questionId: string, choiceId: string) {
		const answer = userAnswers[questionId]
		if (!answer) return ""

		const question = questions.find((q) => q.id === questionId)
		if (!question) return ""

		const choiceIndex = parseInt(choiceId)
		const choice = question.choices[choiceIndex]
		if (!choice) return ""

		const isSelected = answer.selected_answer === choiceId
		const isCorrect = choice.is_correct

		// Only show correct/incorrect styling if the answer has been submitted
		if (!answer.submitted) {
			// Before submission, only show selection styling
			if (isSelected) {
				return "bg-[#E8F4F8] border-[#0094C6] text-[#000022]"
			}
			return "border-[#E8F4F8] hover:border-[#0094C6] hover:bg-[#F8FBFC]"
		}

		// After submission, show correct/incorrect styling
		if (isSelected && isCorrect)
			return "bg-[#DCFCE7] border-[#16A34A] text-[#16A34A]"
		if (isSelected && !isCorrect)
			return "bg-[#FEE2E2] border-[#DC2626] text-[#DC2626]"
		if (isCorrect) return "bg-[#DCFCE7] border-[#16A34A] text-[#16A34A]"
		return "border-[#E8F4F8]"
	}

	// Pagination
	const indexOfLastQuestion = currentPage * questionsPerPage
	const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
	const currentQuestions = filteredQuestions.slice(
		indexOfFirstQuestion,
		indexOfLastQuestion
	)
	const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)

	const nextPage = () =>
		setCurrentPage((prev) => Math.min(prev + 1, totalPages))
	const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

	// Progress tracking
	const answeredCount = Object.values(userAnswers).filter(
		(a) => a.submitted
	).length
	const correctCount = Object.values(userAnswers).filter(
		(a) => a.submitted && a.is_correct
	).length
	const progressPercentage =
		filteredQuestions.length > 0
			? (answeredCount / filteredQuestions.length) * 100
			: 0

	if (loading) {
		return (
			<div className="min-h-screen bg-[#E8F4F8] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094C6] mx-auto"></div>
					<p className="mt-4 text-[#005E7C]">Loading questions...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[#E8F4F8]">
			<div className="max-w-4xl mx-auto px-6 py-12">
				{/* Navigation Header */}
				<div className="mb-6">
					<nav className="flex items-center space-x-4 text-sm">
						<Link
							href="/"
							className="text-[#0094C6] hover:text-[#001242] transition-colors"
						>
							← Back to Dashboard
						</Link>
						<span className="text-[#005E7C]">/</span>
						<span className="text-[#000022] font-medium">Study Questions</span>
					</nav>
				</div>

				{/* Header with Progress */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-4">
						<h1 className="text-3xl font-bold text-[#000022]">
							Series 65 Study Questions
						</h1>
						<Link
							href="/vocab-test"
							className="bg-[#0094C6] text-white px-4 py-2 rounded-lg hover:bg-[#001242] transition-colors"
						>
							📚 Take Vocab Test
						</Link>
					</div>
					<p className="text-[#005E7C] mb-4">
						Practice with {filteredQuestions.length} filtered questions covering
						key topics for the Series 65 exam.
						{filteredQuestions.length !== questions.length && (
							<span className="text-sm text-[#0094C6]">
								{" "}
								({questions.length} total available)
							</span>
						)}
					</p>

					{/* Filter Toggle */}
					<div className="mb-4">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="bg-[#E8F4F8] text-[#005E7C] px-4 py-2 rounded-lg hover:bg-[#D1E7DD] transition-colors flex items-center space-x-2"
						>
							<span>🔍</span>
							<span>{showFilters ? "Hide" : "Show"} Filters</span>
							{(selectedDifficulty !== "all" ||
								selectedCategory !== "all" ||
								selectedTags.length > 0) && (
								<span className="bg-[#0094C6] text-white text-xs px-2 py-1 rounded-full">
									{[
										selectedDifficulty !== "all" ? 1 : 0,
										selectedCategory !== "all" ? 1 : 0,
										selectedTags.length,
									].reduce((a, b) => a + b, 0)}
								</span>
							)}
						</button>
					</div>

					{/* Filters Section */}
					{showFilters && (
						<div className="bg-white border border-[#E8F4F8] rounded-lg p-6 mb-6 shadow-sm">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold text-[#000022]">
									Study Filters
								</h3>
								<button
									onClick={clearFilters}
									className="text-sm text-[#DC2626] hover:text-[#B91C1C] underline transition-colors"
								>
									Clear All Filters
								</button>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								{/* Difficulty Filter */}
								<div>
									<label className="block text-sm font-medium text-[#000022] mb-2">
										Difficulty Level
									</label>
									<select
										value={selectedDifficulty}
										onChange={(e) => setSelectedDifficulty(e.target.value)}
										className="w-full p-2 border border-[#E8F4F8] rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-[#0094C6]"
									>
										<option value="all">All Difficulties</option>
										{availableDifficulties.sort().map((difficulty) => (
											<option key={difficulty} value={difficulty.toString()}>
												Level {difficulty}
											</option>
										))}
									</select>
								</div>

								{/* Category Filter */}
								<div>
									<label className="block text-sm font-medium text-[#000022] mb-2">
										Module/Category
									</label>
									<select
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
										className="w-full p-2 border border-[#E8F4F8] rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-[#0094C6]"
									>
										<option value="all">All Categories</option>
										{availableCategories.sort().map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</select>
								</div>

								{/* Tags Filter */}
								<div>
									<label className="block text-sm font-medium text-[#000022] mb-2">
										Tags
									</label>
									<div className="space-y-2 max-h-32 overflow-y-auto">
										{availableTags.sort().map((tag) => (
											<label key={tag} className="flex items-center space-x-2">
												<input
													type="checkbox"
													checked={selectedTags.includes(tag)}
													onChange={() => toggleTag(tag)}
													className="rounded border-[#E8F4F8] text-[#0094C6] focus:ring-[#0094C6]"
												/>
												<span className="text-sm text-[#005E7C]">{tag}</span>
											</label>
										))}
									</div>
								</div>
							</div>

							{/* Active Filters Display */}
							{(selectedDifficulty !== "all" ||
								selectedCategory !== "all" ||
								selectedTags.length > 0) && (
								<div className="mt-4 pt-4 border-t border-[#E8F4F8]">
									<h4 className="text-sm font-medium text-[#000022] mb-2">
										Active Filters:
									</h4>
									<div className="flex flex-wrap gap-2">
										{selectedDifficulty !== "all" && (
											<span className="bg-[#E8F4F8] text-[#005E7C] px-2 py-1 rounded-full text-xs">
												Difficulty: Level {selectedDifficulty}
											</span>
										)}
										{selectedCategory !== "all" && (
											<span className="bg-[#E8F4F8] text-[#005E7C] px-2 py-1 rounded-full text-xs">
												Category: {selectedCategory}
											</span>
										)}
										{selectedTags.map((tag) => (
											<span
												key={tag}
												className="bg-[#E8F4F8] text-[#005E7C] px-2 py-1 rounded-full text-xs"
											>
												Tag: {tag}
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{/* Progress Bar */}
					<div className="bg-white rounded-full h-3 mb-2 border border-[#E8F4F8]">
						<div
							className="bg-[#0094C6] h-3 rounded-full transition-all duration-300"
							style={{ width: `${progressPercentage}%` }}
						></div>
					</div>

					{/* Progress Stats */}
					<div className="grid grid-cols-4 gap-4 mb-4">
						<div className="bg-white border border-[#E8F4F8] rounded-lg p-3 text-center shadow-sm">
							<div className="text-2xl font-bold text-[#001242]">
								{filteredQuestions.length}
							</div>
							<div className="text-sm text-[#005E7C]">Available</div>
						</div>
						<div className="bg-white border border-[#E8F4F8] rounded-lg p-3 text-center shadow-sm">
							<div className="text-2xl font-bold text-[#001242]">
								{answeredCount}
							</div>
							<div className="text-sm text-[#005E7C]">Submitted</div>
						</div>
						<div className="bg-white border border-[#E8F4F8] rounded-lg p-3 text-center shadow-sm">
							<div className="text-2xl font-bold text-[#16A34A]">
								{correctCount}
							</div>
							<div className="text-sm text-[#005E7C]">Correct</div>
						</div>
						<div className="bg-white border border-[#E8F4F8] rounded-lg p-3 text-center shadow-sm">
							<div className="text-2xl font-bold text-[#0094C6]">
								{filteredQuestions.length > 0
									? Math.round(
											(correctCount / Math.max(answeredCount, 1)) * 100
									  )
									: 0}
								%
							</div>
							<div className="text-sm text-[#005E7C]">Accuracy</div>
						</div>
					</div>

					{/* Progress Summary */}
					{answeredCount > 0 && (
						<div className="bg-white border border-[#E8F4F8] rounded-lg p-4 mb-6 shadow-sm">
							<div className="flex justify-between items-center mb-3">
								<h3 className="text-lg font-semibold text-[#001242]">
									Progress Summary
								</h3>
								<div className="flex items-center space-x-3">
									{/* Progress Persistence Indicator */}
									<div className="flex items-center text-xs text-[#16A34A]">
										<div className="w-2 h-2 bg-[#16A34A] rounded-full mr-2 animate-pulse"></div>
										Progress Saved
									</div>
									<button
										onClick={() => {
											if (
												confirm(
													"Are you sure you want to reset your progress? This will clear all your answers."
												)
											) {
												setUserAnswers({})
												setShowExplanations({})
											}
										}}
										className="text-sm text-[#DC2626] hover:text-[#B91C1C] underline transition-colors"
									>
										Reset Progress
									</button>
								</div>
							</div>

							{/* Historical Performance */}
							{answeredCount > 0 && (
								<div className="mb-4 p-3 bg-[#E8F4F8] rounded-lg">
									<h4 className="font-medium text-[#001242] mb-2 text-sm">
										Historical Performance
									</h4>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
										<div className="text-center">
											<div className="font-bold text-[#000022]">
												{answeredCount}
											</div>
											<div className="text-[#005E7C]">Total Attempts</div>
										</div>
										<div className="text-center">
											<div className="font-bold text-[#16A34A]">
												{correctCount}
											</div>
											<div className="text-[#005E7C]">Correct</div>
										</div>
										<div className="text-center">
											<div className="font-bold text-[#DC2626]">
												{answeredCount - correctCount}
											</div>
											<div className="text-[#005E7C]">Incorrect</div>
										</div>
										<div className="text-center">
											<div className="font-bold text-[#0094C6]">
												{Math.round(
													(correctCount / Math.max(answeredCount, 1)) * 100
												)}
												%
											</div>
											<div className="text-sm text-[#005E7C]">Success Rate</div>
										</div>
									</div>

									{/* Retake Wrong Answers */}
									{answeredCount - correctCount > 0 && (
										<div className="mt-3 pt-3 border-t border-[#0094C6]">
											<button
												onClick={() => {
													// Filter to only show questions user got wrong
													const wrongQuestions = questions.filter(
														(q) =>
															userAnswers[q.id] &&
															userAnswers[q.id].submitted &&
															!userAnswers[q.id].is_correct
													)
													if (wrongQuestions.length > 0) {
														// For now, just show a message - in future this could filter the view
														alert(
															`You have ${wrongQuestions.length} questions to review. Focus on these to improve your score!`
														)
													}
												}}
												className="text-xs bg-[#0094C6] text-white px-3 py-1 rounded hover:bg-[#001242] transition-colors"
											>
												Review Wrong Answers ({answeredCount - correctCount})
											</button>
										</div>
									)}
								</div>
							)}

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
								<div className="text-center">
									<div className="font-medium text-[#005E7C]">
										Total Questions
									</div>
									<div className="text-2xl font-bold text-[#000022]">
										{questions.length}
									</div>
								</div>
								<div className="text-center">
									<div className="font-medium text-[#005E7C]">Completed</div>
									<div className="text-2xl font-bold text-[#16A34A]">
										{answeredCount}
									</div>
								</div>
								<div className="text-center">
									<div className="font-medium text-[#005E7C]">Remaining</div>
									<div className="text-2xl font-bold text-[#0094C6]">
										{questions.length - answeredCount}
									</div>
								</div>
								<div className="text-center">
									<div className="font-medium text-[#005E7C]">Success Rate</div>
									<div className="text-2xl font-bold text-[#16A34A]">
										{Math.round(
											(correctCount / Math.max(answeredCount, 1)) * 100
										)}
										%
									</div>
								</div>
							</div>

							{/* Session Timer */}
							<div className="mt-4 pt-3 border-t border-[#E8F4F8] text-center">
								<div className="text-sm text-[#005E7C]">Study Session Time</div>
								<div className="text-lg font-bold text-[#001242]">
									{Math.floor(sessionTime / 60)}:
									{(sessionTime % 60).toString().padStart(2, "0")}
								</div>
							</div>
						</div>
					)}

					<div className="flex justify-between text-sm text-[#005E7C]">
						<span>
							Progress: {answeredCount} of {questions.length} submitted
						</span>
						<span>Score: {correctCount} correct</span>
					</div>
				</div>

				{/* Questions List */}
				<div className="space-y-6">
					{/* Completion Message */}
					{answeredCount === filteredQuestions.length &&
						filteredQuestions.length > 0 && (
							<div className="bg-white border border-[#16A34A] rounded-lg p-6 text-center shadow-lg">
								<div className="text-6xl mb-4">🎉</div>
								<h2 className="text-2xl font-bold text-[#000022] mb-2">
									Congratulations!
								</h2>
								<p className="text-[#005E7C] mb-4">
									You&apos;ve completed all {filteredQuestions.length} questions
									in this set.
									{filteredQuestions.length !== questions.length && (
										<span className="text-sm text-[#0094C6]">
											{" "}
											(Filtered from {questions.length} total questions)
										</span>
									)}
								</p>

								{/* Final Score Display */}
								<div className="bg-[#E8F4F8] rounded-lg p-4 mb-6">
									<div className="text-3xl font-bold text-[#16A34A] mb-2">
										{Math.round(
											(correctCount / filteredQuestions.length) * 100
										)}
										%
									</div>
									<div className="text-lg text-[#005E7C] mb-2">
										Final Score: {correctCount} out of{" "}
										{filteredQuestions.length}
									</div>
									<div className="text-sm text-[#005E7C]">
										Study Time: {Math.floor(sessionTime / 60)}:
										{(sessionTime % 60).toString().padStart(2, "0")}
									</div>
								</div>

								{/* Performance Analysis */}
								<div className="grid md:grid-cols-3 gap-4 mb-6">
									<div className="bg-[#DCFCE7] p-3 rounded border border-[#16A34A]">
										<div className="text-lg font-bold text-[#16A34A]">
											{correctCount}
										</div>
										<div className="text-sm text-[#15803D]">
											Correct Answers
										</div>
									</div>
									<div className="bg-[#FEE2E2] p-3 rounded border border-[#DC2626]">
										<div className="text-lg font-bold text-[#DC2626]">
											{filteredQuestions.length - correctCount}
										</div>
										<div className="text-sm text-[#B91C1C]">
											Incorrect Answers
										</div>
									</div>
									<div className="bg-[#E8F4F8] p-3 rounded border border-[#0094C6]">
										<div className="text-lg font-bold text-[#0094C6]">
											{Math.round(
												(correctCount / filteredQuestions.length) * 100
											)}
											%
										</div>
										<div className="text-sm text-[#005E7C]">Success Rate</div>
									</div>
								</div>

								{/* Study Recommendations */}
								<div className="bg-[#E8F4F8] rounded-lg p-4 mb-6 text-left">
									<h3 className="font-semibold text-[#001242] mb-3">
										Study Recommendations:
									</h3>
									<ul className="text-sm text-[#005E7C] space-y-2">
										{correctCount >= filteredQuestions.length * 0.8 ? (
											<li className="flex items-center">
												<span className="text-[#16A34A] mr-2">✓</span>
												Excellent work! You&apos;re ready for the exam.
											</li>
										) : correctCount >= filteredQuestions.length * 0.6 ? (
											<li className="flex items-center">
												<span className="text-[#0094C6] mr-2">→</span>
												Good progress! Review incorrect answers to improve.
											</li>
										) : (
											<li className="flex items-center">
												<span className="text-[#DC2626] mr-2">!</span>
												Keep practicing! Focus on understanding the concepts.
											</li>
										)}
										<li className="flex items-center">
											<span className="text-[#0094C6] mr-2">→</span>
											Review explanations for incorrect answers
										</li>
										<li className="flex items-center">
											<span className="text-[#0094C6] mr-2">→</span>
											Take a break and return for another session
										</li>
									</ul>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-col sm:flex-row gap-3 justify-center">
									<Link
										href="/vocab-test"
										className="bg-[#0094C6] text-white px-6 py-3 rounded-lg hover:bg-[#001242] transition-colors text-center"
									>
										📚 Take Vocab Test
									</Link>
									<button
										onClick={() => {
											setUserAnswers({})
											setShowExplanations({})
											setSessionTime(0)
										}}
										className="bg-[#16A34A] text-white px-6 py-3 rounded-lg hover:bg-[#15803D] transition-colors"
									>
										Retake Questions
									</button>
								</div>
							</div>
						)}

					{currentQuestions.map((question, index) => {
						const answerStatus = getAnswerStatus(question.id)
						const showExplanation = showExplanations[question.id]
						const isSubmitting = submitting[question.id]

						return (
							<div
								key={question.id}
								className="bg-white border border-[#E8F4F8] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
							>
								{/* Question Header */}
								<div className="flex items-center justify-between mb-4">
									<span className="text-sm font-medium text-[#005E7C]">
										Question {indexOfFirstQuestion + index + 1} of{" "}
										{questions.length}
									</span>
									<div className="flex items-center space-x-2">
										<span className="px-2 py-1 text-xs font-medium bg-[#E8F4F8] text-[#001242] rounded-full">
											{question.category}
										</span>
										<span className="px-2 py-1 text-xs font-medium bg-[#E8F4F8] text-[#005E7C] rounded-full">
											Level {question.difficulty_level}
										</span>
										{answerStatus !== "unanswered" && (
											<span
												className={`px-2 py-1 text-xs font-medium rounded-full ${
													answerStatus === "correct"
														? "bg-[#DCFCE7] text-[#16A34A]"
														: "bg-[#FEE2E2] text-[#DC2626]"
												}`}
											>
												{answerStatus === "correct"
													? "✓ Correct"
													: "✗ Incorrect"}
											</span>
										)}
									</div>
								</div>

								{/* Question Text */}
								<h3 className="text-lg font-medium text-[#000022] mb-4">
									{question.question_text}
								</h3>

								{/* Question Choices */}
								<div className="space-y-3 mb-4">
									{question.choices.map((choice, choiceIndex) => (
										<label
											key={choiceIndex}
											className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${getChoiceStyle(
												question.id,
												choiceIndex.toString()
											)}`}
										>
											<input
												type="radio"
												name={`question-${question.id}`}
												value={choiceIndex.toString()}
												checked={
													userAnswers[question.id]?.selected_answer ===
													choiceIndex.toString()
												}
												disabled={isSubmitting}
												onChange={async (e) => {
													const choiceIndex = parseInt(e.target.value)
													const selectedChoice = question.choices[choiceIndex]

													const newAnswer: UserAnswer = {
														question_id: question.id,
														selected_answer: e.target.value,
														is_correct: selectedChoice.is_correct,
														answered_at: new Date(),
														submitted: false,
													}

													// Update local state immediately
													const newAnswers = {
														...userAnswers,
														[question.id]: newAnswer,
													}
													setUserAnswers(newAnswers)

													// Save to database immediately (but not as submitted)
													try {
														const supabase = createClient()
														const {
															data: { user },
														} = await supabase.auth.getUser()
														if (user) {
															await supabase.from("user_progress").upsert({
																user_id: user.id,
																question_id: question.id,
																selected_answer: newAnswer.selected_answer,
																is_correct: newAnswer.is_correct,
																last_attempted_at:
																	newAnswer.answered_at.toISOString(),
																submitted: false,
																attempts: 0, // Will be updated when submitted
																correct_attempts: 0, // Will be updated when submitted
															})
														}
													} catch (error) {
														console.error(
															"Error saving answer selection:",
															error
														)
													}
												}}
												className="mr-3"
											/>
											<span className="text-[#000022]">{choice.text}</span>
										</label>
									))}
								</div>

								{/* Submit Button */}
								{userAnswers[question.id]?.selected_answer &&
									!userAnswers[question.id]?.submitted && (
										<div className="mb-4">
											<button
												onClick={() => submitAnswer(question.id)}
												disabled={submitting[question.id]}
												className="w-full bg-[#0094C6] text-white py-3 px-6 rounded-lg hover:bg-[#001242] transition-colors disabled:opacity-50"
											>
												{submitting[question.id]
													? "Submitting..."
													: "Submit Answer"}
											</button>
										</div>
									)}

								{/* Tags */}
								{question.tags && question.tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-4">
										{question.tags.map((tag, tagIndex) => (
											<span
												key={tagIndex}
												className="px-2 py-1 text-xs font-medium bg-[#E8F4F8] text-[#005E7C] rounded-full"
											>
												{tag}
											</span>
										))}
									</div>
								)}

								{/* Answer & Explanation */}
								{showExplanation && (
									<div className="pt-4 border-t border-[#E8F4F8]">
										<div className="bg-[#E8F4F8] rounded-lg p-4">
											<h4 className="font-medium text-[#000022] mb-2">
												Explanation:
											</h4>
											<p className="text-[#005E7C] text-sm mb-3">
												{question.explanation}
											</p>

											{/* Answer History */}
											{userAnswers[question.id] && (
												<div className="mt-3 pt-3 border-t border-[#0094C6]">
													<h5 className="font-medium text-[#000022] mb-2 text-sm">
														Your Answer:
													</h5>
													<div className="flex items-center space-x-2">
														<span
															className={`px-2 py-1 text-xs font-medium rounded-full ${
																userAnswers[question.id].is_correct
																	? "bg-[#DCFCE7] text-[#16A34A]"
																	: "bg-[#FEE2E2] text-[#DC2626]"
															}`}
														>
															{userAnswers[question.id].selected_answer}
														</span>
														<span className="text-xs text-[#005E7C]">
															{userAnswers[question.id].is_correct
																? "✓ Correct"
																: "✗ Incorrect"}
														</span>
													</div>
													{!userAnswers[question.id].is_correct && (
														<div className="mt-2 text-xs text-[#005E7C]">
															Correct answer:{" "}
															<span className="font-medium text-[#16A34A]">
																{question.correct_answer}
															</span>
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								)}

								{/* Action Button */}
								{!showExplanation && answerStatus !== "unanswered" && (
									<div className="pt-4 border-t border-[#E8F4F8]">
										<button
											onClick={() =>
												setShowExplanations((prev) => ({
													...prev,
													[question.id]: true,
												}))
											}
											className="text-[#0094C6] hover:text-[#001242] text-sm font-medium mr-4 transition-colors"
										>
											Show Answer & Explanation →
										</button>
										<button
											onClick={() => {
												setUserAnswers((prev) => {
													const newAnswers = { ...prev }
													delete newAnswers[question.id]
													return newAnswers
												})
												setShowExplanations((prev) => ({
													...prev,
													[question.id]: false,
												}))
											}}
											className="text-[#005E7C] hover:text-[#000022] text-sm font-medium transition-colors"
										>
											Change Answer
										</button>
									</div>
								)}
							</div>
						)
					})}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-8 flex items-center justify-center space-x-4">
						<button
							onClick={prevPage}
							disabled={currentPage === 1}
							className="px-4 py-2 text-sm font-medium text-[#005E7C] bg-white border border-[#E8F4F8] rounded-md hover:bg-[#E8F4F8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Previous
						</button>
						<span className="text-sm text-[#005E7C]">
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={nextPage}
							disabled={currentPage === totalPages}
							className="px-4 py-2 text-sm font-medium text-[#005E7C] bg-white border border-[#E8F4F8] rounded-md hover:bg-[#E8F4F8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default function QuestionsPage() {
	const { user } = useAuth()

	if (!user) {
		return (
			<div className="min-h-screen bg-[#E8F4F8] flex items-center justify-center">
				<div className="text-center">
					<p className="text-[#005E7C]">Please sign in to access questions.</p>
				</div>
			</div>
		)
	}

	return <QuestionsContent />
}
