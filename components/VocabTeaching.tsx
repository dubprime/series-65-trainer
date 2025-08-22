import { useState } from "react"

interface VocabTerm {
	id: string
	term: string
	definition: string
	example?: string
	category: string
}

interface VocabTeachingProps {
	terms: VocabTerm[]
	onComplete: () => void
}

export default function VocabTeaching({
	terms,
	onComplete,
}: VocabTeachingProps) {
	const [currentTermIndex, setCurrentTermIndex] = useState(0)
	const [showDefinition, setShowDefinition] = useState(false)
	const [completedTerms, setCompletedTerms] = useState<Set<string>>(new Set()) // Will be used for progress tracking

	const currentTerm = terms[currentTermIndex]
	const isLastTerm = currentTermIndex === terms.length - 1

	const handleNext = () => {
		if (showDefinition) {
			// Mark current term as completed
			setCompletedTerms((prev) => new Set([...prev, currentTerm.id]))

			if (isLastTerm) {
				// All terms completed
				onComplete()
			} else {
				// Move to next term
				setCurrentTermIndex((prev) => prev + 1)
				setShowDefinition(false)
			}
		} else {
			// Show definition
			setShowDefinition(true)
		}
	}

	const handleSkip = () => {
		if (isLastTerm) {
			onComplete()
		} else {
			setCurrentTermIndex((prev) => prev + 1)
			setShowDefinition(false)
		}
	}

	return (
		<div className="min-h-screen bg-[#E8F4F8] flex items-center justify-center p-6">
			<div className="max-w-2xl w-full">
				{/* Progress Header */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-4 mb-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-[#000022]">
							📚 Key Concepts Review
						</h2>
						<div className="text-sm text-[#005E7C]">
							{currentTermIndex + 1} of {terms.length}
						</div>
					</div>

					{/* Progress Bar */}
					<div className="bg-[#E8F4F8] rounded-full h-2">
						<div
							className="bg-[#0094C6] h-2 rounded-full transition-all duration-300"
							style={{
								width: `${((currentTermIndex + 1) / terms.length) * 100}%`,
							}}
						></div>
					</div>
				</div>

				{/* Term Card */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-8 text-center">
					{/* Category Badge */}
					<div className="inline-block bg-[#E8F4F8] text-[#005E7C] px-3 py-1 rounded-full text-sm font-medium mb-4">
						{currentTerm.category}
					</div>

					{/* Term */}
					<h3 className="text-3xl font-bold text-[#000022] mb-6">
						{currentTerm.term}
					</h3>

					{/* Definition */}
					{showDefinition ? (
						<div className="space-y-4">
							<div className="bg-[#E8F4F8] rounded-lg p-6 text-left">
								<h4 className="font-semibold text-[#001242] mb-2">
									Definition:
								</h4>
								<p className="text-[#005E7C] text-lg leading-relaxed">
									{currentTerm.definition}
								</p>
							</div>

							{currentTerm.example && (
								<div className="bg-[#F8FBFC] rounded-lg p-6 text-left border border-[#E8F4F8]">
									<h4 className="font-semibold text-[#001242] mb-2">
										Example:
									</h4>
									<p className="text-[#005E7C] italic">{currentTerm.example}</p>
								</div>
							)}
						</div>
					) : (
						<div className="text-center py-8">
							<div className="text-6xl mb-4">🤔</div>
							<p className="text-[#005E7C] text-lg">
								Click &quot;Show Definition&quot; to learn about this concept
							</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex justify-center space-x-4 mt-8">
						{!showDefinition ? (
							<button
								onClick={handleNext}
								className="bg-[#0094C6] text-white px-8 py-3 rounded-lg hover:bg-[#001242] transition-colors font-medium"
							>
								Show Definition
							</button>
						) : (
							<button
								onClick={handleNext}
								className="bg-[#16A34A] text-white px-8 py-3 rounded-lg hover:bg-[#15803D] transition-colors font-medium"
							>
								{isLastTerm ? "Start Questions" : "Next Concept"}
							</button>
						)}

						<button
							onClick={handleSkip}
							className="bg-[#6B7280] text-white px-6 py-3 rounded-lg hover:bg-[#4B5563] transition-colors font-medium"
						>
							{isLastTerm ? "Skip to Questions" : "Skip"}
						</button>
					</div>
				</div>

				{/* Study Tips */}
				<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-4 mt-6">
					<div className="flex items-center justify-center text-[#005E7C] text-sm">
						<span className="mr-2">💡</span>
						<span>
							{showDefinition
								? "Take a moment to understand this concept before moving on"
								: "Understanding key terms will help you answer questions correctly"}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
