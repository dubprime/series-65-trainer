import ProtectedRoute from "@/components/ProtectedRoute"
import PerformanceAnalytics from "@/components/PerformanceAnalytics"
import Link from "next/link"

export default function AnalyticsPage() {
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-[#E8F4F8] p-6">
				<div className="max-w-6xl mx-auto">
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
							<span className="text-[#000022] font-medium">Performance Analytics</span>
						</nav>
					</div>

					{/* Header */}
					<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6 mb-6">
						<h1 className="text-3xl font-bold text-[#000022] mb-2">
							📈 Performance Analytics
						</h1>
						<p className="text-[#005E7C]">
							Track your progress, identify strengths and weaknesses, and get
							personalized study recommendations.
						</p>
					</div>

					{/* Analytics Content */}
					<PerformanceAnalytics />
				</div>
			</div>
		</ProtectedRoute>
	)
}
