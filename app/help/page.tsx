import ProtectedRoute from "@/components/ProtectedRoute"
import HelpOnboarding from "@/components/HelpOnboarding"

export default function HelpPage() {
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-[#E8F4F8] p-6">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6 mb-6">
						<h1 className="text-3xl font-bold text-[#000022] mb-2">
							❓ Help & Support
						</h1>
						<p className="text-[#005E7C]">
							Get help with using the platform and learn how to study
							effectively
						</p>
					</div>

					{/* Help Content */}
					<HelpOnboarding />
				</div>
			</div>
		</ProtectedRoute>
	)
}
