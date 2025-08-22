import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
// import { defaultSpacedRepetition } from "@/lib/algorithms/spaced-repetition" // Will be used for default config

interface StudyGoal {
	id: string
	title: string
	description: string
	targetAccuracy: number
	targetQuestions: number
	deadline: Date
	progress: number
	status: "active" | "completed" | "overdue"
}

interface StudySession {
	id: string
	date: Date
	duration: number
	questionsAnswered: number
	accuracy: number
	goalId?: string
}

export default function StudySessionManager() {
	const [goals, setGoals] = useState<StudyGoal[]>([])
	const [sessions, setSessions] = useState<StudySession[]>([])
	// const [showGoalForm, setShowGoalForm] = useState(false) // Will be used for goal form modal
	// const [showSessionForm, setShowSessionForm] = useState(false) // Will be used for session form modal
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchStudyData()
	}, [])

	async function fetchStudyData() {
		try {
			const supabase = createClient()
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) return

			// Fetch study goals and sessions from database
			// For now, we'll use mock data until we create the database tables
			const mockGoals: StudyGoal[] = [
				{
					id: "1",
					title: "Master Regulatory Concepts",
					description: "Achieve 85% accuracy on all regulatory questions",
					targetAccuracy: 85,
					targetQuestions: 50,
					deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
					progress: 65,
					status: "active",
				},
				{
					id: "2",
					title: "Complete Investment Basics",
					description: "Answer 100 questions on investment fundamentals",
					targetAccuracy: 80,
					targetQuestions: 100,
					deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
					progress: 45,
					status: "active",
				},
			]

			const mockSessions: StudySession[] = [
				{
					id: "1",
					date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
					duration: 45,
					questionsAnswered: 15,
					accuracy: 87,
					goalId: "1",
				},
				{
					id: "2",
					date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
					duration: 30,
					questionsAnswered: 10,
					accuracy: 80,
					goalId: "2",
				},
			]

			setGoals(mockGoals)
			setSessions(mockSessions)
			setLoading(false)
		} catch (error) {
			console.error("Error fetching study data:", error)
			setLoading(false)
		}
	}

	function getGoalStatusColor(status: string): string {
		switch (status) {
			case "completed":
				return "text-[#16A34A] bg-[#DCFCE7]"
			case "overdue":
				return "text-[#DC2626] bg-[#FEE2E2]"
			default:
				return "text-[#0094C6] bg-[#DBEAFE]"
		}
	}

	function getProgressColor(progress: number): string {
		if (progress >= 80) return "bg-[#16A34A]"
		if (progress >= 60) return "bg-[#0094C6]"
		return "bg-[#DC2626]"
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0094C6]"></div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-[#000022]">
					Study Session Manager
				</h2>
				<div className="space-x-3">
								<button
									onClick={() => console.log("Goal form will be implemented")}
									className="bg-[#16A34A] text-white px-4 py-2 rounded-lg hover:bg-[#15803D] transition-colors"
								>
									🎯 New Goal
								</button>
					<button
						onClick={() => console.log("Session form will be implemented")}
						className="bg-[#0094C6] text-white px-4 py-2 rounded-lg hover:bg-[#001242] transition-colors"
					>
						📝 Log Session
					</button>
				</div>
			</div>

			{/* Study Goals */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					Study Goals
				</h3>
				{goals.length === 0 ? (
					<div className="text-center py-8 text-[#005E7C]">
						<div className="text-4xl mb-2">🎯</div>
						<p>No study goals set yet</p>
						<p className="text-sm">
							Set your first goal to start tracking progress
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{goals.map((goal) => (
							<div
								key={goal.id}
								className="border border-[#E8F4F8] rounded-lg p-4"
							>
								<div className="flex justify-between items-start mb-3">
									<div>
										<h4 className="font-semibold text-[#000022]">
											{goal.title}
										</h4>
										<p className="text-sm text-[#005E7C]">{goal.description}</p>
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${getGoalStatusColor(
											goal.status
										)}`}
									>
										{goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
									</span>
								</div>

								<div className="grid md:grid-cols-3 gap-4 mb-3">
									<div className="text-center">
										<div className="text-sm text-[#005E7C]">
											Target Accuracy
										</div>
										<div className="text-lg font-bold text-[#000022]">
											{goal.targetAccuracy}%
										</div>
									</div>
									<div className="text-center">
										<div className="text-sm text-[#005E7C]">
											Target Questions
										</div>
										<div className="text-lg font-bold text-[#000022]">
											{goal.targetQuestions}
										</div>
									</div>
									<div className="text-center">
										<div className="text-sm text-[#005E7C]">Deadline</div>
										<div className="text-lg font-bold text-[#000022]">
											{goal.deadline.toLocaleDateString()}
										</div>
									</div>
								</div>

								<div className="mb-3">
									<div className="flex justify-between text-sm text-[#005E7C] mb-1">
										<span>Progress</span>
										<span>{goal.progress}%</span>
									</div>
									<div className="bg-[#E8F4F8] rounded-full h-2">
										<div
											className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
												goal.progress
											)}`}
											style={{ width: `${goal.progress}%` }}
										></div>
									</div>
								</div>

								<div className="flex justify-between items-center">
									<div className="text-xs text-[#005E7C]">
										{goal.deadline > new Date() ? (
											<span>
												{Math.ceil(
													(goal.deadline.getTime() - Date.now()) /
														(1000 * 60 * 60 * 24)
												)}{" "}
												days remaining
											</span>
										) : (
											<span className="text-[#DC2626]">
												{Math.ceil(
													(Date.now() - goal.deadline.getTime()) /
														(1000 * 60 * 60 * 24)
												)}{" "}
												days overdue
											</span>
										)}
									</div>
									<div className="space-x-2">
										<button className="text-[#0094C6] hover:text-[#001242] text-sm underline">
											Edit
										</button>
										<button className="text-[#DC2626] hover:text-[#B91C1C] text-sm underline">
											Delete
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Recent Study Sessions */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					Recent Study Sessions
				</h3>
				{sessions.length === 0 ? (
					<div className="text-center py-8 text-[#005E7C]">
						<div className="text-4xl mb-2">📚</div>
						<p>No study sessions logged yet</p>
						<p className="text-sm">
							Start studying to see your session history
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{sessions.map((session) => (
							<div
								key={session.id}
								className="flex items-center justify-between p-3 bg-[#F8FBFC] rounded-lg"
							>
								<div className="flex items-center space-x-4">
									<div className="text-2xl">📚</div>
									<div>
										<div className="font-medium text-[#000022]">
											{session.date.toLocaleDateString()} -{" "}
											{session.date.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
										<div className="text-sm text-[#005E7C]">
											{session.duration} minutes • {session.questionsAnswered}{" "}
											questions
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-lg font-bold text-[#000022]">
										{session.accuracy}%
									</div>
									<div className="text-sm text-[#005E7C]">Accuracy</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Study Recommendations */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					Study Recommendations
				</h3>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="p-4 bg-[#E8F4F8] rounded-lg">
						<h4 className="font-medium text-[#001242] mb-2">
							📅 Daily Study Plan
						</h4>
						<p className="text-sm text-[#005E7C]">
							Based on your goals, aim for 30-45 minutes of study time today.
						</p>
					</div>
					<div className="p-4 bg-[#E8F4F8] rounded-lg">
						<h4 className="font-medium text-[#001242] mb-2">
							🎯 Priority Focus
						</h4>
						<p className="text-sm text-[#005E7C]">
							Focus on regulatory concepts to meet your weekly goal.
						</p>
					</div>
					<div className="p-4 bg-[#E8F4F8] rounded-lg">
						<h4 className="font-medium text-[#001242] mb-2">
							⏰ Optimal Study Time
						</h4>
						<p className="text-sm text-[#005E7C]">
							Your best performance is in the morning. Schedule sessions
							accordingly.
						</p>
					</div>
					<div className="p-4 bg-[#E8F4F8] rounded-lg">
						<h4 className="font-medium text-[#001242] mb-2">
							📊 Progress Tracking
						</h4>
						<p className="text-sm text-[#005E7C]">
							You&apos;re on track to complete your goals. Keep up the good
							work!
						</p>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					Quick Actions
				</h3>
				<div className="grid md:grid-cols-3 gap-4">
					<button className="p-4 bg-[#0094C6] text-white rounded-lg hover:bg-[#001242] transition-colors text-center">
						<div className="text-2xl mb-2">🚀</div>
						<div className="font-semibold">Start Study Session</div>
						<div className="text-sm opacity-90">Begin practicing now</div>
					</button>
					<button className="p-4 bg-[#16A34A] text-white rounded-lg hover:bg-[#15803D] transition-colors text-center">
						<div className="text-2xl mb-2">📚</div>
						<div className="font-semibold">Review Vocab</div>
						<div className="text-sm opacity-90">Brush up on concepts</div>
					</button>
					<button className="p-4 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-colors text-center">
						<div className="text-2xl mb-2">📊</div>
						<div className="font-semibold">View Analytics</div>
						<div className="text-sm opacity-90">Check your progress</div>
					</button>
				</div>
			</div>
		</div>
	)
}
