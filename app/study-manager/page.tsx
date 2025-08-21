"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import Link from "next/link"
import StudySessionManager from "@/components/StudySessionManager"
import StudySessionPlanner from "@/components/StudySessionPlanner"
import StudyStreaks from "@/components/StudyStreaks"
import StudyRecommendations from "@/components/StudyRecommendations"
import { useState } from "react"

export default function StudyManagerPage() {
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-[#E8F4F8]">
				<div className="max-w-4xl mx-auto px-6 py-8">
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
							<span className="text-[#000022] font-medium">Study Manager</span>
						</nav>
					</div>
					<StudyManagerContent />
				</div>
			</div>
		</ProtectedRoute>
	)
}

function StudyManagerContent() {
	const [activeTab, setActiveTab] = useState<
		"goals" | "planner" | "sessions" | "achievements" | "recommendations"
	>("goals")

	return (
		<div className="min-h-screen bg-[#E8F4F8] p-6">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6 mb-6">
					<h1 className="text-3xl font-bold text-[#000022] mb-2">
						📚 Study Manager
					</h1>
					<p className="text-[#005E7C]">
						Set goals, plan sessions, and track your study progress
					</p>
				</div>

				{/* Navigation Tabs */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-2 mb-6">
					<div className="flex space-x-1">
						{[
							{ id: "goals", label: "🎯 Goals & Progress", icon: "🎯" },
							{ id: "planner", label: "📋 Session Planner", icon: "📋" },
							{ id: "sessions", label: "📊 Session History", icon: "📊" },
							{ id: "achievements", label: "🏆 Achievements", icon: "🏆" },
							{
								id: "recommendations",
								label: "💡 Recommendations",
								icon: "💡",
							},
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as "goals" | "planner" | "sessions" | "achievements" | "recommendations")}
								className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
									activeTab === tab.id
										? "bg-[#0094C6] text-white shadow-sm"
										: "text-[#005E7C] hover:text-[#000022] hover:bg-[#E8F4F8]"
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{/* Tab Content */}
				{activeTab === "goals" && <StudySessionManager />}

				{activeTab === "planner" && (
					<div className="space-y-6">
						<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
							<h2 className="text-2xl font-bold text-[#000022] mb-4">
								Session Planner
							</h2>
							<p className="text-[#005E7C] mb-6">
								Plan your study sessions using intelligent algorithms that adapt
								to your performance.
							</p>
							<StudySessionPlanner
								onStartSession={(questionIds, sessionType) => {
									console.log("Starting session:", { questionIds, sessionType })
									// In a real app, this would redirect to the questions page with the selected questions
									alert(
										`Starting ${sessionType} session with ${questionIds.length} questions!`
									)
								}}
							/>
						</div>
					</div>
				)}

				{activeTab === "sessions" && (
					<div className="space-y-6">
						<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
							<h2 className="text-2xl font-bold text-[#000022] mb-4">
								Session History
							</h2>
							<p className="text-[#005E7C] mb-6">
								Track your study sessions and analyze your learning patterns
								over time.
							</p>

							{/* Session Statistics */}
							<div className="grid md:grid-cols-4 gap-4 mb-6">
								<div className="bg-[#E8F4F8] rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-[#000022]">12</div>
									<div className="text-sm text-[#005E7C]">Total Sessions</div>
								</div>
								<div className="bg-[#E8F4F8] rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-[#16A34A]">8.5</div>
									<div className="text-sm text-[#005E7C]">Avg. Hours</div>
								</div>
								<div className="bg-[#E8F4F8] rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-[#0094C6]">85%</div>
									<div className="text-sm text-[#005E7C]">Avg. Accuracy</div>
								</div>
								<div className="bg-[#E8F4F8] rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-[#DC2626]">3.2</div>
									<div className="text-sm text-[#005E7C]">Questions/Hour</div>
								</div>
							</div>

							{/* Study Streak */}
							<div className="bg-[#FEF3C7] rounded-lg p-4 mb-6">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-semibold text-[#000022]">
											🔥 Study Streak
										</h3>
										<p className="text-sm text-[#005E7C]">
											You've studied for 5 consecutive days!
										</p>
									</div>
									<div className="text-3xl">🔥</div>
								</div>
							</div>

							{/* Weekly Progress Chart Placeholder */}
							<div className="bg-[#F8FBFC] rounded-lg p-8 text-center border border-[#E8F4F8]">
								<div className="text-4xl mb-2">📊</div>
								<h3 className="font-semibold text-[#000022] mb-2">
									Weekly Progress Chart
								</h3>
								<p className="text-[#005E7C] text-sm">
									Visual representation of your study progress over the past
									week
								</p>
								<p className="text-[#005E7C] text-xs mt-2">
									(Chart visualization would be implemented here)
								</p>
							</div>
						</div>
					</div>
				)}

				{activeTab === "achievements" && <StudyStreaks />}

				{activeTab === "recommendations" && <StudyRecommendations />}
			</div>
		</div>
	)
}
