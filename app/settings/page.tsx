import ProtectedRoute from "@/components/ProtectedRoute"
import UserSettings from "@/components/UserSettings"
import Link from "next/link"

export default function SettingsPage() {
	return (
		<ProtectedRoute>
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
							<span className="text-[#000022] font-medium">Settings</span>
						</nav>
					</div>

					{/* Header */}
					<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6 mb-6">
						<h1 className="text-3xl font-bold text-[#000022] mb-2">
							⚙️ Settings
						</h1>
						<p className="text-[#005E7C]">
							Customize your study experience and manage your preferences
						</p>
					</div>

					{/* Settings Content */}
					<UserSettings />
				</div>
			</div>
		</ProtectedRoute>
	)
}
