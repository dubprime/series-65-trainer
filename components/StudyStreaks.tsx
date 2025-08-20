import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Achievement {
	id: string
	title: string
	description: string
	icon: string
	unlocked: boolean
	unlockedAt?: Date
	progress: number
	maxProgress: number
}

interface StudyStreak {
	currentStreak: number
	longestStreak: number
	lastStudyDate: Date
	consecutiveDays: number
}

export default function StudyStreaks() {
	const [achievements, setAchievements] = useState<Achievement[]>([])
	const [streak, setStreak] = useState<StudyStreak>({
		currentStreak: 0,
		longestStreak: 0,
		lastStudyDate: new Date(),
		consecutiveDays: 0,
	})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadAchievementsAndStreaks()
	}, [])

	async function loadAchievementsAndStreaks() {
		try {
			const supabase = createClient()
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) return

			// Mock data for now - in production this would come from the database
			const mockAchievements: Achievement[] = [
				{
					id: "first-session",
					title: "First Steps",
					description: "Complete your first study session",
					icon: "🚀",
					unlocked: true,
					unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
					progress: 1,
					maxProgress: 1,
				},
				{
					id: "streak-3",
					title: "Getting Consistent",
					description: "Study for 3 consecutive days",
					icon: "🔥",
					unlocked: true,
					unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
					progress: 3,
					maxProgress: 3,
				},
				{
					id: "streak-7",
					title: "Week Warrior",
					description: "Study for 7 consecutive days",
					icon: "⚡",
					unlocked: false,
					progress: 5,
					maxProgress: 7,
				},
				{
					id: "accuracy-80",
					title: "Sharp Shooter",
					description: "Achieve 80% accuracy in a session",
					icon: "🎯",
					unlocked: true,
					unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
					progress: 87,
					maxProgress: 80,
				},
				{
					id: "questions-100",
					title: "Century Club",
					description: "Answer 100 questions",
					icon: "💯",
					unlocked: false,
					progress: 65,
					maxProgress: 100,
				},
				{
					id: "goals-3",
					title: "Goal Setter",
					description: "Set 3 study goals",
					icon: "🎯",
					unlocked: false,
					progress: 2,
					maxProgress: 3,
				},
			]

			const mockStreak: StudyStreak = {
				currentStreak: 5,
				longestStreak: 12,
				lastStudyDate: new Date(),
				consecutiveDays: 5,
			}

			setAchievements(mockAchievements)
			setStreak(mockStreak)
			setLoading(false)
		} catch (error) {
			console.error("Error loading achievements:", error)
			setLoading(false)
		}
	}

	function getAchievementStatus(achievement: Achievement) {
		if (achievement.unlocked) {
			return "bg-[#DCFCE7] border-[#16A34A] text-[#16A34A]"
		}
		return "bg-[#F8FBFC] border-[#E8F4F8] text-[#005E7C]"
	}

	function getProgressColor(progress: number, maxProgress: number) {
		const percentage = (progress / maxProgress) * 100
		if (percentage >= 80) return "bg-[#16A34A]"
		if (percentage >= 60) return "bg-[#0094C6]"
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
				<h2 className="text-2xl font-bold text-[#000022]">🏆 Achievements & Streaks</h2>
			</div>

			{/* Study Streak */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">🔥 Study Streak</h3>
				<div className="grid md:grid-cols-3 gap-6">
					<div className="text-center">
						<div className="text-4xl mb-2">🔥</div>
						<div className="text-2xl font-bold text-[#000022]">{streak.currentStreak}</div>
						<div className="text-sm text-[#005E7C]">Current Streak</div>
					</div>
					<div className="text-center">
						<div className="text-4xl mb-2">🏆</div>
						<div className="text-2xl font-bold text-[#000022]">{streak.longestStreak}</div>
						<div className="text-sm text-[#005E7C]">Longest Streak</div>
					</div>
					<div className="text-center">
						<div className="text-4xl mb-2">📅</div>
						<div className="text-2xl font-bold text-[#000022]">
							{streak.lastStudyDate.toLocaleDateString()}
						</div>
						<div className="text-sm text-[#005E7C]">Last Study Date</div>
					</div>
				</div>

				{/* Streak Motivation */}
				{streak.currentStreak > 0 && (
					<div className="mt-6 p-4 bg-[#FEF3C7] rounded-lg">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-semibold text-[#000022]">
									🔥 {streak.currentStreak} Day{streak.currentStreak > 1 ? "s" : ""} Strong!
								</h4>
								<p className="text-sm text-[#005E7C]">
									{streak.currentStreak >= 7
										? "Incredible consistency! You're building excellent study habits."
										: streak.currentStreak >= 3
										? "Great start! Keep the momentum going."
										: "You're on your way! Study again tomorrow to build your streak."}
								</p>
							</div>
							<div className="text-3xl">
								{streak.currentStreak >= 7 ? "🚀" : streak.currentStreak >= 3 ? "💪" : "👍"}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Achievements */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">🏆 Achievements</h3>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					{achievements.map((achievement) => (
						<div
							key={achievement.id}
							className={`p-4 rounded-lg border transition-all ${
								achievement.unlocked
									? "shadow-md transform hover:scale-105"
									: "opacity-75"
							} ${getAchievementStatus(achievement)}`}
						>
							<div className="text-center">
								<div className="text-3xl mb-2">{achievement.icon}</div>
								<h4 className="font-semibold text-[#000022] mb-1">
									{achievement.title}
								</h4>
								<p className="text-sm text-[#005E7C] mb-3">
									{achievement.description}
								</p>

								{/* Progress Bar */}
								<div className="mb-3">
									<div className="flex justify-between text-xs text-[#005E7C] mb-1">
										<span>Progress</span>
										<span>
											{achievement.progress} / {achievement.maxProgress}
										</span>
									</div>
									<div className="bg-[#E8F4F8] rounded-full h-2">
										<div
											className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
												achievement.progress,
												achievement.maxProgress
											)}`}
											style={{
												width: `${Math.min(
													(achievement.progress / achievement.maxProgress) * 100,
													100
												)}%`,
											}}
										></div>
									</div>
								</div>

								{/* Status */}
								{achievement.unlocked ? (
									<div className="text-xs text-[#16A34A] font-medium">
										✅ Unlocked{" "}
										{achievement.unlockedAt?.toLocaleDateString()}
									</div>
								) : (
									<div className="text-xs text-[#005E7C]">
										{achievement.maxProgress - achievement.progress} more to go
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Next Milestones */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">🎯 Next Milestones</h3>
				<div className="space-y-3">
					{achievements
						.filter((a) => !a.unlocked)
						.slice(0, 3)
						.map((achievement) => (
							<div key={achievement.id} className="flex items-center justify-between p-3 bg-[#F8FBFC] rounded-lg">
								<div className="flex items-center space-x-3">
									<div className="text-2xl">{achievement.icon}</div>
									<div>
										<div className="font-medium text-[#000022]">{achievement.title}</div>
										<div className="text-sm text-[#005E7C]">{achievement.description}</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-medium text-[#000022]">
										{achievement.progress} / {achievement.maxProgress}
									</div>
									<div className="text-xs text-[#005E7C]">
										{achievement.maxProgress - achievement.progress} more needed
									</div>
								</div>
							</div>
						))}
				</div>
			</div>

			{/* Motivation */}
			<div className="bg-[#E8F4F8] rounded-lg p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">💪 Stay Motivated</h3>
				<div className="grid md:grid-cols-2 gap-4 text-sm">
					<div>
						<h4 className="font-medium text-[#001242] mb-2">🔥 Keep Your Streak Alive</h4>
						<p className="text-[#005E7C]">
							Study for just 15 minutes today to maintain your {streak.currentStreak}-day streak!
						</p>
					</div>
					<div>
						<h4 className="font-medium text-[#001242] mb-2">🎯 Focus on Weak Areas</h4>
						<p className="text-[#005E7C]">
							Use the spaced repetition system to improve your weakest categories.
						</p>
					</div>
					<div>
						<h4 className="font-medium text-[#001242] mb-2">📚 Mix It Up</h4>
						<p className="text-[#005E7C]">
							Try different session types to keep your study routine fresh and engaging.
						</p>
					</div>
					<div>
						<h4 className="font-medium text-[#001242] mb-2">🏆 Celebrate Progress</h4>
						<p className="text-[#005E7C]">
							Every question answered brings you closer to your next achievement!
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
