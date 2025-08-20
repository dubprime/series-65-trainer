import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface PerformanceData {
	totalQuestions: number
	totalSessions: number
	overallAccuracy: number
	averageScore: number
	bestScore: number
	weakestCategory: string
	strongestCategory: string
	studyTime: number
	improvementTrend: "improving" | "declining" | "stable"
}

interface CategoryPerformance {
	category: string
	correct: number
	total: number
	accuracy: number
}

export default function PerformanceAnalytics() {
	const [performanceData, setPerformanceData] =
		useState<PerformanceData | null>(null)
	const [categoryPerformance, setCategoryPerformance] = useState<
		CategoryPerformance[]
	>([])
	const [loading, setLoading] = useState(true)
	const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("all")

	useEffect(() => {
		fetchPerformanceData()
	}, [timeRange])

	async function fetchPerformanceData() {
		try {
			const supabase = createClient()
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) return

			// Fetch user progress data
			const { data: progress, error } = await supabase
				.from("user_progress")
				.select(
					`
					*,
					questions (
						category,
						difficulty_level
					)
				`
				)
				.eq("user_id", user.id)

			if (error) {
				console.error("Error fetching performance data:", error)
				return
			}

			// Calculate performance metrics
			const submittedAnswers = progress?.filter((p) => p.submitted) || []
			const totalQuestions = submittedAnswers.length
			const correctAnswers = submittedAnswers.filter((p) => p.is_correct).length
			const overallAccuracy =
				totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

			// Calculate category performance
			const categoryMap = new Map<string, { correct: number; total: number }>()
			submittedAnswers.forEach((answer) => {
				const category = answer.questions?.category || "Unknown"
				const current = categoryMap.get(category) || { correct: 0, total: 0 }
				current.total++
				if (answer.is_correct) current.correct++
				categoryMap.set(category, current)
			})

			const categoryData: CategoryPerformance[] = Array.from(
				categoryMap.entries()
			)
				.map(([category, data]) => ({
					category,
					correct: data.correct,
					total: data.total,
					accuracy: (data.correct / data.total) * 100,
				}))
				.sort((a, b) => b.accuracy - a.accuracy)

			// Determine strongest and weakest categories
			const strongestCategory = categoryData[0]?.category || "None"
			const weakestCategory =
				categoryData[categoryData.length - 1]?.category || "None"

			// Calculate improvement trend (simplified - in real app would compare time periods)
			const improvementTrend: "improving" | "declining" | "stable" =
				overallAccuracy >= 80
					? "improving"
					: overallAccuracy >= 60
					? "stable"
					: "declining"

			setPerformanceData({
				totalQuestions,
				totalSessions: Math.ceil(totalQuestions / 5), // Assuming 5 questions per session
				overallAccuracy,
				averageScore: overallAccuracy,
				bestScore: Math.max(
					...submittedAnswers.map((p) => (p.is_correct ? 100 : 0))
				),
				weakestCategory,
				strongestCategory,
				studyTime: 0, // Would need to track actual study time
				improvementTrend,
			})

			setCategoryPerformance(categoryData)
			setLoading(false)
		} catch (error) {
			console.error("Error fetching performance data:", error)
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0094C6]"></div>
			</div>
		)
	}

	if (!performanceData) {
		return (
			<div className="text-center p-8 text-[#005E7C]">
				No performance data available yet. Start studying to see your analytics!
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Time Range Selector */}
			<div className="flex justify-center space-x-2">
				{["week", "month", "all"].map((range) => (
					<button
						key={range}
						onClick={() => setTimeRange(range as "week" | "month" | "all")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							timeRange === range
								? "bg-[#0094C6] text-white"
								: "bg-white text-[#005E7C] hover:bg-[#E8F4F8]"
						}`}
					>
						{range.charAt(0).toUpperCase() + range.slice(1)}
					</button>
				))}
			</div>

			{/* Key Metrics */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-4 text-center">
					<div className="text-2xl font-bold text-[#000022]">
						{performanceData.totalQuestions}
					</div>
					<div className="text-sm text-[#005E7C]">Questions Answered</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-4 text-center">
					<div className="text-2xl font-bold text-[#16A34A]">
						{performanceData.overallAccuracy.toFixed(1)}%
					</div>
					<div className="text-sm text-[#005E7C]">Overall Accuracy</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-4 text-center">
					<div className="text-2xl font-bold text-[#0094C6]">
						{performanceData.totalSessions}
					</div>
					<div className="text-sm text-[#005E7C]">Study Sessions</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-4 text-center">
					<div className="text-2xl font-bold text-[#DC2626]">
						{performanceData.bestScore}%
					</div>
					<div className="text-sm text-[#005E7C]">Best Score</div>
				</div>
			</div>

			{/* Performance Insights */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					Performance Insights
				</h3>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-[#001242] mb-3">Strengths</h4>
						<div className="space-y-2">
							<div className="flex items-center justify-between p-3 bg-[#DCFCE7] rounded-lg">
								<span className="text-[#16A34A] font-medium">
									Strongest Category
								</span>
								<span className="text-[#000022]">
									{performanceData.strongestCategory}
								</span>
							</div>
							<div className="flex items-center justify-between p-3 bg-[#DCFCE7] rounded-lg">
								<span className="text-[#16A34A] font-medium">
									Overall Trend
								</span>
								<span
									className={`font-medium ${
										performanceData.improvementTrend === "improving"
											? "text-[#16A34A]"
											: performanceData.improvementTrend === "stable"
											? "text-[#0094C6]"
											: "text-[#DC2626]"
									}`}
								>
									{performanceData.improvementTrend.charAt(0).toUpperCase() +
										performanceData.improvementTrend.slice(1)}
								</span>
							</div>
						</div>
					</div>
					<div>
						<h4 className="font-medium text-[#001242] mb-3">
							Areas for Improvement
						</h4>
						<div className="space-y-2">
							<div className="flex items-center justify-between p-3 bg-[#FEE2E2] rounded-lg">
								<span className="text-[#DC2626] font-medium">
									Weakest Category
								</span>
								<span className="text-[#000022]">
									{performanceData.weakestCategory}
								</span>
							</div>
							<div className="flex items-center justify-between p-3 bg-[#FEE2E2] rounded-lg">
								<span className="text-[#DC2626] font-medium">
									Target Accuracy
								</span>
								<span className="text-[#000022]">80%+</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Category Breakdown */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					Performance by Category
				</h3>
				<div className="space-y-3">
					{categoryPerformance.map((category) => (
						<div
							key={category.category}
							className="flex items-center justify-between p-3 bg-[#F8FBFC] rounded-lg"
						>
							<div className="flex-1">
								<div className="font-medium text-[#000022]">
									{category.category}
								</div>
								<div className="text-sm text-[#005E7C]">
									{category.correct} of {category.total} correct
								</div>
							</div>
							<div className="text-right">
								<div className="text-lg font-bold text-[#001242]">
									{category.accuracy.toFixed(1)}%
								</div>
								<div className="text-xs text-[#005E7C]">Accuracy</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Study Recommendations */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					Study Recommendations
				</h3>
				<div className="space-y-3">
					{performanceData.weakestCategory !== "None" && (
						<div className="flex items-start p-3 bg-[#FEF3C7] rounded-lg">
							<span className="text-[#D97706] mr-3 mt-1">🎯</span>
							<div>
								<div className="font-medium text-[#000022]">
									Focus on {performanceData.weakestCategory}
								</div>
								<div className="text-sm text-[#005E7C]">
									This category has your lowest accuracy. Consider reviewing the
									concepts and taking more practice questions.
								</div>
							</div>
						</div>
					)}
					{performanceData.overallAccuracy < 80 && (
						<div className="flex items-start p-3 bg-[#DBEAFE] rounded-lg">
							<span className="text-[#2563EB] mr-3 mt-1">📚</span>
							<div>
								<div className="font-medium text-[#000022]">
									Review Key Concepts
								</div>
								<div className="text-sm text-[#005E7C]">
									Your overall accuracy suggests reviewing the vocab terms and
									fundamental concepts would be beneficial.
								</div>
							</div>
						</div>
					)}
					{performanceData.overallAccuracy >= 80 && (
						<div className="flex items-start p-3 bg-[#DCFCE7] rounded-lg">
							<span className="text-[#16A34A] mr-3 mt-1">🎉</span>
							<div>
								<div className="font-medium text-[#000022]">
									Excellent Progress!
								</div>
								<div className="text-sm text-[#005E7C]">
									You&apos;re performing well! Consider taking more challenging
									questions or exploring new topics.
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
