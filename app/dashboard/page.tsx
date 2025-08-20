"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/lib/contexts/AuthContext"
import Link from "next/link"

export default function DashboardPage() {
	return (
		<ProtectedRoute>
			<DashboardContent />
		</ProtectedRoute>
	)
}

function DashboardContent() {
	const { user, signOut } = useAuth()

	return (
		<div className="min-h-screen bg-[#E8F4F8] p-6">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6 mb-6">
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-3xl font-bold text-[#000022]">
								Welcome back, {user?.user_metadata?.first_name || "Student"}!
							</h1>
							<p className="text-[#005E7C] mt-2">
								Ready to continue your Series 65 exam preparation?
							</p>
						</div>
						<button
							onClick={signOut}
							className="bg-[#DC2626] text-white px-4 py-2 rounded-lg hover:bg-[#B91C1C] transition-colors"
						>
							Sign Out
						</button>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="grid md:grid-cols-3 gap-6 mb-6">
					<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-[#005E7C]">Total Questions</p>
								<p className="text-2xl font-bold text-[#000022]">6</p>
							</div>
							<div className="text-3xl">📚</div>
						</div>
					</div>
					<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-[#005E7C]">Study Sessions</p>
								<p className="text-2xl font-bold text-[#000022]">0</p>
							</div>
							<div className="text-3xl">⏱️</div>
						</div>
					</div>
					<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-[#005E7C]">Best Score</p>
								<p className="text-2xl font-bold text-[#000022]">--</p>
							</div>
							<div className="text-3xl">🏆</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6 mb-6">
					<h2 className="text-xl font-semibold text-[#000022] mb-4">
						Quick Actions
					</h2>
					<div className="grid md:grid-cols-4 gap-4">
						<Link
							href="/questions"
							className="bg-[#0094C6] text-white p-4 rounded-lg hover:bg-[#001242] transition-colors text-center"
						>
							<div className="text-2xl mb-2">🚀</div>
							<div className="font-semibold">Start Study Session</div>
							<div className="text-sm opacity-90">Practice with questions</div>
						</Link>
						<Link
							href="/questions"
							className="bg-[#16A34A] text-white p-4 rounded-lg hover:bg-[#15803D] transition-colors text-center"
						>
							<div className="text-2xl mb-2">📊</div>
							<div className="font-semibold">Review Progress</div>
							<div className="text-sm opacity-90">See your performance</div>
						</Link>
						<Link
							href="/analytics"
							className="bg-[#DC2626] text-white p-4 rounded-lg hover:bg-[#B91C1C] transition-colors text-center"
						>
							<div className="text-2xl mb-2">📈</div>
							<div className="font-semibold">Performance Analytics</div>
							<div className="text-sm opacity-90">Detailed insights</div>
						</Link>
						<Link
							href="/study-manager"
							className="bg-[#7C3AED] text-white p-4 rounded-lg hover:bg-[#6D28D9] transition-colors text-center"
						>
							<div className="text-2xl mb-2">🎯</div>
							<div className="font-semibold">Study Manager</div>
							<div className="text-sm opacity-90">
								Set goals & plan sessions
							</div>
						</Link>
					</div>
				</div>

				{/* Study Recommendations */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6 mb-6">
					<h2 className="text-xl font-semibold text-[#000022] mb-4">
						Study Recommendations
					</h2>
					<div className="space-y-3">
						<div className="flex items-center p-3 bg-[#E8F4F8] rounded-lg">
							<span className="text-[#0094C6] mr-3">💡</span>
							<div>
								<p className="font-medium text-[#000022]">
									Start with a practice session
								</p>
								<p className="text-sm text-[#005E7C]">
									Begin with the questions to assess your current knowledge
								</p>
							</div>
						</div>
						<div className="flex items-center p-3 bg-[#E8F4F8] rounded-lg">
							<span className="text-[#0094C6] mr-3">📈</span>
							<div>
								<p className="font-medium text-[#000022]">
									Track your progress
								</p>
								<p className="text-sm text-[#005E7C]">
									Monitor your performance and identify areas for improvement
								</p>
							</div>
						</div>
						<div className="flex items-center p-3 bg-[#E8F4F8] rounded-lg">
							<span className="text-[#0094C6] mr-3">🎯</span>
							<div>
								<p className="font-medium text-[#000022]">
									Focus on weak areas
								</p>
								<p className="text-sm text-[#005E7C]">
									Review questions you got wrong to strengthen your knowledge
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
					<h2 className="text-xl font-semibold text-[#000022] mb-4">
						Recent Activity
					</h2>
					<div className="text-center py-8 text-[#005E7C]">
						<div className="text-4xl mb-2">📝</div>
						<p>No recent activity yet</p>
						<p className="text-sm">Start studying to see your progress here</p>
					</div>
				</div>
			</div>
		</div>
	)
}
