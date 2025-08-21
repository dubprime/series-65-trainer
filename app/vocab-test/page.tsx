"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"

interface VocabQuestion {
	id: string
	term: string
	definition: string
	choices: Array<{ text: string; is_correct: boolean }>
	example?: string
}

interface VocabAnswer {
	question_id: string
	selected_answer: string
	is_correct: boolean
	answered_at: Date
	submitted: boolean
}

export default function VocabTestPage() {
	return (
		<ProtectedRoute>
			<VocabTestContent />
		</ProtectedRoute>
	)
}

function VocabTestContent() {
	const { user } = useAuth()
	const [questions, setQuestions] = useState<VocabQuestion[]>([])
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [userAnswers, setUserAnswers] = useState<Record<string, VocabAnswer>>(
		{}
	)
	const [showResults, setShowResults] = useState(false)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)

	// Score tracking
	const [score, setScore] = useState(0)
	const [totalAnswered, setTotalAnswered] = useState(0)
	const [showHint, setShowHint] = useState(false)

	useEffect(() => {
		generateVocabQuestions()
	}, [])

	function generateVocabQuestions() {
		// Generate vocab questions from the terms
		const vocabTerms = [
			{
				term: "Accredited Investor",
				definition:
					"An individual or entity that meets certain financial criteria and is allowed to invest in securities not available to the general public.",
				example:
					"Someone with a net worth over $1 million or annual income over $200,000.",
			},
			{
				term: "Blue Sky Laws",
				definition:
					"State securities laws that protect investors from fraudulent sales practices and activities.",
				example:
					"State-level regulations that complement federal securities laws.",
			},
			{
				term: "Due Diligence",
				definition:
					"The investigation and analysis a reasonable person should conduct before entering into an agreement or transaction.",
				example:
					"Researching a company's financial statements before investing.",
			},
			{
				term: "Fiduciary Duty",
				definition:
					"A legal obligation to act in the best interests of another party, putting their interests ahead of your own.",
				example:
					"Investment advisors must act in their clients' best interests.",
			},
			{
				term: "Insider Trading",
				definition:
					"Trading securities based on material, non-public information about a company.",
				example:
					"A company executive trading stock before announcing earnings.",
			},
			{
				term: "Prospectus",
				definition:
					"A formal legal document that provides details about an investment offering for sale to the public.",
				example: "A document filed with the SEC before an IPO.",
			},
			{
				term: "Securities",
				definition:
					"Financial instruments that represent ownership in a publicly-traded corporation or a creditor relationship with a governmental body or corporation.",
				example: "Stocks, bonds, and mutual funds are all types of securities.",
			},
			{
				term: "Underwriter",
				definition:
					"A financial institution that guarantees the sale of a company's securities by purchasing any unsold shares.",
				example: "Investment banks that help companies go public.",
			},
			{
				term: "Volatility",
				definition:
					"A measure of the rate at which the price of a security increases or decreases for a given set of returns.",
				example:
					"A stock that frequently changes in price has high volatility.",
			},
			{
				term: "Yield",
				definition:
					"The income return on an investment, expressed as a percentage of the investment's cost or current market value.",
				example: "A bond paying 5% annually has a 5% yield.",
			},
		]

		// Convert terms to quiz format with 4 choices each
		const quizQuestions: VocabQuestion[] = vocabTerms.map((term, index) => {
			// Generate 3 incorrect choices for each term
			const otherTerms = vocabTerms.filter((_, i) => i !== index)
			const incorrectChoices = otherTerms
				.sort(() => Math.random() - 0.5)
				.slice(0, 3)
				.map((t) => ({ text: t.definition, is_correct: false }))

			// Create the correct choice
			const correctChoice = { text: term.definition, is_correct: true }

			// Combine and shuffle choices
			const allChoices = [...incorrectChoices, correctChoice].sort(
				() => Math.random() - 0.5
			)

			return {
				id: `vocab-${index}`,
				term: term.term,
				definition: term.definition,
				choices: allChoices,
				example: term.example,
			}
		})

		// Shuffle the questions
		const shuffledQuestions = quizQuestions.sort(() => Math.random() - 0.5)
		setQuestions(shuffledQuestions)
		setLoading(false)
	}

	function handleAnswerSelect(choiceIndex: string) {
		const question = questions[currentQuestionIndex]
		if (!question) return

		const selectedChoice = question.choices[parseInt(choiceIndex)]

		setUserAnswers((prev) => ({
			...prev,
			[question.id]: {
				question_id: question.id,
				selected_answer: choiceIndex,
				is_correct: selectedChoice.is_correct,
				answered_at: new Date(),
				submitted: false,
			},
		}))
	}

	function submitAnswer() {
		const question = questions[currentQuestionIndex]
		if (!question) return

		const currentAnswer = userAnswers[question.id]
		if (!currentAnswer) return

		// Update the answer as submitted
		setUserAnswers((prev) => ({
			...prev,
			[question.id]: {
				...prev[question.id],
				submitted: true,
			},
		}))

		// Track score
		setTotalAnswered((prev) => prev + 1)
		if (currentAnswer.is_correct) {
			setScore((prev) => prev + 1)
		}

		// Hide hint for next question
		setShowHint(false)
	}

	function nextQuestion() {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1)
			setShowHint(false) // Hide hint for next question
		} else {
			setShowResults(true)
		}
	}

	function getChoiceStyle(choiceIndex: string) {
		const question = questions[currentQuestionIndex]
		if (!question) return ""

		const answer = userAnswers[question.id]
		if (!answer || !answer.submitted) {
			// Before submission
			if (answer?.selected_answer === choiceIndex) {
				return "bg-[#E8F4F8] border-[#0094C6] text-[#000022]"
			}
			return "border-[#E8F4F8] hover:border-[#0094C6] hover:bg-[#F8FBFC]"
		}

		// After submission
		const choice = question.choices[parseInt(choiceIndex)]
		if (answer.selected_answer === choiceIndex) {
			return choice.is_correct
				? "bg-[#DCFCE7] border-[#16A34A] text-[#16A34A]"
				: "bg-[#FEE2E2] border-[#DC2626] text-[#DC2626]"
		}
		if (choice.is_correct) {
			return "bg-[#DCFCE7] border-[#16A34A] text-[#16A34A]"
		}
		return "border-[#E8F4F8]"
	}

	function resetTest() {
		setCurrentQuestionIndex(0)
		setUserAnswers({})
		setShowResults(false)
		setScore(0)
		setTotalAnswered(0)
		setShowHint(false)
		generateVocabQuestions()
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-[#E8F4F8] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094C6] mx-auto"></div>
					<p className="mt-4 text-[#005E7C]">Loading vocab test...</p>
				</div>
			</div>
		)
	}

	if (showResults) {
		const correctAnswers = score
		const totalQuestions = questions.length
		const percentage = Math.round((score / totalQuestions) * 100)

		return (
			<div className="min-h-screen bg-[#E8F4F8] p-6">
				<div className="max-w-4xl mx-auto">
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
							<span className="text-[#000022] font-medium">
								Vocab Test Results
							</span>
						</nav>
					</div>

					{/* Results */}
					<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-8 text-center">
						<h1 className="text-4xl font-bold text-[#000022] mb-6">
							🎯 Vocab Test Complete!
						</h1>

						<div className="text-6xl mb-4">
							{percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"}
						</div>

						<div className="text-2xl font-bold text-[#000022] mb-2">
							{correctAnswers} out of {totalQuestions} correct
						</div>

						<div className="text-xl text-[#005E7C] mb-6">
							{percentage}% accuracy
						</div>

						<div className="space-y-4">
							<button
								onClick={resetTest}
								className="bg-[#0094C6] text-white px-6 py-3 rounded-lg hover:bg-[#001242] transition-colors mr-4"
							>
								🔄 Take Test Again
							</button>

							<Link
								href="/questions"
								className="bg-[#16A34A] text-white px-6 py-3 rounded-lg hover:bg-[#15803D] transition-colors"
							>
								🚀 Start Study Session
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const currentQuestion = questions[currentQuestionIndex]
	const currentAnswer = userAnswers[currentQuestion.id]

	return (
		<div className="min-h-screen bg-[#E8F4F8] p-6">
			<div className="max-w-4xl mx-auto">
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
						<span className="text-[#000022] font-medium">Vocab Test</span>
					</nav>
				</div>

				{/* Progress */}
				<div className="mb-6">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-[#005E7C]">
							Question {currentQuestionIndex + 1} of {questions.length}
						</span>
						<span className="text-sm text-[#005E7C]">
							{Math.round(
								((currentQuestionIndex + 1) / questions.length) * 100
							)}
							% Complete
						</span>
					</div>
					<div className="bg-white rounded-full h-2 border border-[#E8F4F8]">
						<div
							className="bg-[#0094C6] h-2 rounded-full transition-all duration-300"
							style={{
								width: `${
									((currentQuestionIndex + 1) / questions.length) * 100
								}%`,
							}}
						></div>
					</div>
				</div>

				{/* Score Display */}
				<div className="mb-6">
					<div className="bg-white border border-[#E8F4F8] rounded-lg p-4 shadow-sm">
						<div className="flex justify-between items-center">
							<div className="text-center">
								<div className="text-2xl font-bold text-[#16A34A]">{score}</div>
								<div className="text-sm text-[#005E7C]">Correct</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-[#DC2626]">
									{totalAnswered - score}
								</div>
								<div className="text-sm text-[#005E7C]">Incorrect</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-[#0094C6]">
									{totalAnswered > 0
										? Math.round((score / totalAnswered) * 100)
										: 0}
									%
								</div>
								<div className="text-sm text-[#005E7C]">Accuracy</div>
							</div>
						</div>
					</div>
				</div>

				{/* Question */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6 mb-6">
					<h2 className="text-2xl font-bold text-[#000022] mb-4">
						What is the definition of &quot;{currentQuestion.term}&quot;?
					</h2>

					{/* Choices */}
					<div className="space-y-3 mb-6">
						{currentQuestion.choices.map((choice, index) => (
							<label
								key={index}
								className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${getChoiceStyle(
									index.toString()
								)}`}
							>
								<input
									type="radio"
									name={`question-${currentQuestion.id}`}
									value={index.toString()}
									checked={currentAnswer?.selected_answer === index.toString()}
									onChange={(e) => handleAnswerSelect(e.target.value)}
									className="mr-3"
									disabled={currentAnswer?.submitted}
								/>
								<span className="text-[#000022]">{choice.text}</span>
							</label>
						))}
					</div>

					{/* Hint (if available) */}
					{currentQuestion.example && (
						<div className="mb-4">
							{!showHint ? (
								<button
									onClick={() => setShowHint(true)}
									className="bg-[#F8FBFC] text-[#0094C6] px-4 py-2 rounded-lg border border-[#E8F4F8] hover:bg-[#E8F4F8] transition-colors flex items-center space-x-2"
								>
									<span>💡</span>
									<span>Show Hint</span>
								</button>
							) : (
								<div className="bg-[#F8FBFC] rounded-lg p-4 border border-[#E8F4F8]">
									<div className="flex justify-between items-start mb-2">
										<p className="text-sm text-[#005E7C] font-medium">
											💡 Hint:
										</p>
										<button
											onClick={() => setShowHint(false)}
											className="text-[#005E7C] hover:text-[#001242] text-sm underline"
										>
											Hide
										</button>
									</div>
									<p className="text-sm text-[#005E7C]">
										{currentQuestion.example}
									</p>
								</div>
							)}
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex justify-between">
						{currentQuestionIndex > 0 && (
							<button
								onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
								className="bg-[#005E7C] text-white px-4 py-2 rounded-lg hover:bg-[#001242] transition-colors"
							>
								← Previous
							</button>
						)}

						<div className="flex space-x-4">
							{currentAnswer && !currentAnswer.submitted && (
								<button
									onClick={submitAnswer}
									className="bg-[#0094C6] text-white px-6 py-2 rounded-lg hover:bg-[#001242] transition-colors"
								>
									Submit Answer
								</button>
							)}

							{currentAnswer?.submitted && (
								<button
									onClick={nextQuestion}
									className="bg-[#16A34A] text-white px-6 py-2 rounded-lg hover:bg-[#15803D] transition-colors"
								>
									{currentQuestionIndex === questions.length - 1
										? "See Results"
										: "Next Question"}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
