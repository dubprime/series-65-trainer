import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { defaultSpacedRepetition, QuestionPriority } from "@/lib/algorithms/spaced-repetition"

interface StudySessionPlannerProps {
	onStartSession: (questionIds: string[], sessionType: string) => void
}

type SessionType = "adaptive" | "weak-areas" | "mixed-difficulty" | "category-focus"

export default function StudySessionPlanner({ onStartSession }: StudySessionPlannerProps) {
	const [sessionType, setSessionType] = useState<SessionType>("adaptive")
	const [selectedCategory, setSelectedCategory] = useState<string>("")
	const [sessionSize, setSessionSize] = useState<number>(5)
	const [availableCategories, setAvailableCategories] = useState<string[]>([])
	const [loading, setLoading] = useState(false)
	const [sessionPreview, setSessionPreview] = useState<QuestionPriority[]>([])

	useEffect(() => {
		fetchAvailableCategories()
	}, [])

	useEffect(() => {
		if (sessionType && sessionSize > 0) {
			generateSessionPreview()
		}
	}, [sessionType, selectedCategory, sessionSize])

	async function fetchAvailableCategories() {
		try {
			const supabase = createClient()
			const { data: questions, error } = await supabase
				.from("questions")
				.select("category")
				.order("category")

			if (error) {
				console.error("Error fetching categories:", error)
				return
			}

			const categories = [...new Set(questions?.map(q => q.category) || [])]
			setAvailableCategories(categories)
			if (categories.length > 0) {
				setSelectedCategory(categories[0])
			}
		} catch (error) {
			console.error("Error fetching categories:", error)
		}
	}

	async function generateSessionPreview() {
		setLoading(true)
		try {
			const supabase = createClient()
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) return

			// Fetch questions and user progress
			const { data: questions, error: questionsError } = await supabase
				.from("questions")
				.select("id, difficulty_level, category")

			const { data: progress, error: progressError } = await supabase
				.from("user_progress")
				.select("*")
				.eq("user_id", user.id)

			if (questionsError || progressError) {
				console.error("Error fetching data:", { questionsError, progressError })
				return
			}

			// Convert progress to the format expected by the algorithm
			const userProgress: Record<string, {
				attempts: number
				correctAttempts: number
				lastAttempted: Date
			}> = {}

			progress?.forEach((p) => {
				userProgress[p.question_id] = {
					attempts: p.attempts || 0,
					correctAttempts: p.correct_attempts || 0,
					lastAttempted: new Date(p.last_attempted_at),
				}
			})

			// Generate session based on type
			let prioritizedQuestions: QuestionPriority[] = []

			switch (sessionType) {
				case "adaptive":
					prioritizedQuestions = defaultSpacedRepetition.getPrioritizedQuestions(
						questions || [],
						userProgress,
						sessionSize
					)
					break
				case "weak-areas":
					if (selectedCategory) {
						prioritizedQuestions = defaultSpacedRepetition.getWeakAreaQuestions(
							questions || [],
							userProgress,
							selectedCategory,
							sessionSize
						)
					}
					break
				case "mixed-difficulty":
					prioritizedQuestions = defaultSpacedRepetition.getMixedDifficultyQuestions(
						questions || [],
						userProgress,
						sessionSize
					)
					break
				case "category-focus":
					if (selectedCategory) {
						const categoryQuestions = questions?.filter(q => q.category === selectedCategory) || []
						prioritizedQuestions = defaultSpacedRepetition.getPrioritizedQuestions(
							categoryQuestions,
							userProgress,
							sessionSize
						)
					}
					break
			}

			setSessionPreview(prioritizedQuestions)
		} catch (error) {
			console.error("Error generating session preview:", error)
		} finally {
			setLoading(false)
		}
	}

	function handleStartSession() {
		const questionIds = sessionPreview.map(q => q.questionId)
		onStartSession(questionIds, sessionType)
	}

	function getSessionTypeDescription(type: SessionType): string {
		switch (type) {
			case "adaptive":
				return "Intelligent selection based on your performance and spaced repetition algorithm"
			case "weak-areas":
				return "Focus on categories where you need improvement"
			case "mixed-difficulty":
				return "Balanced mix of easy, medium, and hard questions"
			case "category-focus":
				return "Concentrated practice in a specific subject area"
			default:
				return ""
		}
	}

	return (
		<div className="space-y-6">
			{/* Session Type Selection */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">Choose Study Session Type</h3>
				<div className="grid md:grid-cols-2 gap-4">
					{[
						{ type: "adaptive", label: "🎯 Adaptive Learning", icon: "🧠" },
						{ type: "weak-areas", label: "📚 Weak Areas Focus", icon: "🎯" },
						{ type: "mixed-difficulty", label: "⚖️ Mixed Difficulty", icon: "📊" },
						{ type: "category-focus", label: "🎯 Category Focus", icon: "📁" },
					].map(({ type, label, icon }) => (
						<button
							key={type}
							onClick={() => setSessionType(type as SessionType)}
							className={`p-4 rounded-lg border transition-all text-left ${
								sessionType === type
									? "border-[#0094C6] bg-[#E8F4F8] text-[#000022]"
									: "border-[#E8F4F8] hover:border-[#0094C6] hover:bg-[#F8FBFC]"
							}`}
						>
							<div className="text-2xl mb-2">{icon}</div>
							<div className="font-medium">{label}</div>
							<div className="text-sm text-[#005E7C] mt-1">
								{getSessionTypeDescription(type as SessionType)}
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Session Configuration */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">Session Configuration</h3>
				<div className="grid md:grid-cols-3 gap-6">
					<div>
						<label className="block text-sm font-medium text-[#001242] mb-2">
							Session Size
						</label>
						<select
							value={sessionSize}
							onChange={(e) => setSessionSize(Number(e.target.value))}
							className="w-full p-3 border border-[#E8F4F8] rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent"
						>
							<option value={3}>3 questions</option>
							<option value={5}>5 questions</option>
							<option value={10}>10 questions</option>
							<option value={15}>15 questions</option>
						</select>
					</div>

					{(sessionType === "weak-areas" || sessionType === "category-focus") && (
						<div>
							<label className="block text-sm font-medium text-[#001242] mb-2">
								Category
							</label>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="w-full p-3 border border-[#E8F4F8] rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent"
							>
								{availableCategories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>
					)}

					<div className="flex items-end">
						<button
							onClick={generateSessionPreview}
							disabled={loading}
							className="w-full bg-[#0094C6] text-white px-6 py-3 rounded-lg hover:bg-[#001242] transition-colors disabled:opacity-50"
						>
							{loading ? "Generating..." : "Update Preview"}
						</button>
					</div>
				</div>
			</div>

			{/* Session Preview */}
			{sessionPreview.length > 0 && (
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
					<h3 className="text-lg font-semibold text-[#000022] mb-4">Session Preview</h3>
					<div className="space-y-3">
						{sessionPreview.map((question, index) => (
							<div key={question.questionId} className="flex items-center justify-between p-3 bg-[#F8FBFC] rounded-lg">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-[#0094C6] text-white rounded-full flex items-center justify-center text-sm font-bold">
										{index + 1}
									</div>
									<div>
										<div className="text-sm text-[#005E7C]">Question {question.questionId.slice(0, 8)}...</div>
										<div className="text-xs text-[#005E7C]">{question.reason}</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-medium text-[#000022]">
										{question.accuracy > 0 ? `${(question.accuracy * 100).toFixed(0)}%` : "New"}
									</div>
									<div className="text-xs text-[#005E7C]">
										Level {question.difficulty}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-6 text-center">
						<button
							onClick={handleStartSession}
							className="bg-[#16A34A] text-white px-8 py-3 rounded-lg hover:bg-[#15803D] transition-colors font-medium"
						>
							🚀 Start Study Session
						</button>
					</div>
				</div>
			)}

			{/* Session Type Benefits */}
			<div className="bg-[#E8F4F8] rounded-lg p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">💡 Session Type Benefits</h3>
				<div className="grid md:grid-cols-2 gap-4 text-sm">
					<div>
						<h4 className="font-medium text-[#001242] mb-2">🎯 Adaptive Learning</h4>
						<p className="text-[#005E7C]">
							Uses spaced repetition to show questions when you need to review them most.
						</p>
					</div>
					<div>
						<h4 className="font-medium text-[#001242] mb-2">📚 Weak Areas Focus</h4>
						<p className="text-[#005E7C]">
							Concentrates on categories where your accuracy is below 70%.
						</p>
					</div>
					<div>
						<h4 className="font-medium text-[#001242] mb-2">⚖️ Mixed Difficulty</h4>
						<p className="text-[#005E7C]">
							Balanced mix of easy (30%), medium (40%), and hard (30%) questions.
						</p>
					</div>
					<div>
						<h4 className="font-medium text-[#001242] mb-2">🎯 Category Focus</h4>
						<p className="text-[#005E7C]">
							Deep dive into a specific subject area for concentrated practice.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
