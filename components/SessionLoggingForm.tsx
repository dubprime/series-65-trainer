import { useState } from "react"

interface SessionLoggingFormProps {
	onSave: (session: {
		date: Date
		duration: number
		questionsAnswered: number
		accuracy: number
		notes?: string
	}) => void
	onCancel: () => void
}

export default function SessionLoggingForm({
	onSave,
	onCancel,
}: SessionLoggingFormProps) {
	const [date, setDate] = useState(new Date().toISOString().split("T")[0])
	const [duration, setDuration] = useState(30)
	const [questionsAnswered, setQuestionsAnswered] = useState(10)
	const [accuracy, setAccuracy] = useState(80)
	const [notes, setNotes] = useState("")
	const [errors, setErrors] = useState<Record<string, string>>({})

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {}

		if (!date) {
			newErrors.date = "Date is required"
		}

		if (duration < 5 || duration > 300) {
			newErrors.duration = "Duration must be between 5 and 300 minutes"
		}

		if (questionsAnswered < 1 || questionsAnswered > 100) {
			newErrors.questionsAnswered =
				"Questions answered must be between 1 and 100"
		}

		if (accuracy < 0 || accuracy > 100) {
			newErrors.accuracy = "Accuracy must be between 0% and 100%"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		onSave({
			date: new Date(date),
			duration,
			questionsAnswered,
			accuracy,
			notes: notes.trim() || undefined,
		})
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					<h2 className="text-xl font-semibold text-[#000022] mb-4">
						Log Study Session
					</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-[#001242] mb-2">
								Session Date *
							</label>
							<input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								max={new Date().toISOString().split("T")[0]}
								className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent ${
									errors.date ? "border-[#DC2626]" : "border-[#E8F4F8]"
								}`}
							/>
							{errors.date && (
								<p className="text-[#DC2626] text-sm mt-1">{errors.date}</p>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-[#001242] mb-2">
									Duration (minutes) *
								</label>
								<input
									type="number"
									value={duration}
									onChange={(e) => setDuration(Number(e.target.value))}
									min="5"
									max="300"
									className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent ${
										errors.duration ? "border-[#DC2626]" : "border-[#E8F4F8]"
									}`}
								/>
								{errors.duration && (
									<p className="text-[#DC2626] text-sm mt-1">
										{errors.duration}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-[#001242] mb-2">
									Questions Answered *
								</label>
								<input
									type="number"
									value={questionsAnswered}
									onChange={(e) => setQuestionsAnswered(Number(e.target.value))}
									min="1"
									max="100"
									className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent ${
										errors.questionsAnswered
											? "border-[#DC2626]"
											: "border-[#E8F4F8]"
									}`}
								/>
								{errors.questionsAnswered && (
									<p className="text-[#DC2626] text-sm mt-1">
										{errors.questionsAnswered}
									</p>
								)}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-[#001242] mb-2">
								Accuracy (%) *
							</label>
							<input
								type="number"
								value={accuracy}
								onChange={(e) => setAccuracy(Number(e.target.value))}
								min="0"
								max="100"
								className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent ${
									errors.accuracy ? "border-[#DC2626]" : "border-[#E8F4F8]"
								}`}
							/>
							{errors.accuracy && (
								<p className="text-[#DC2626] text-sm mt-1">{errors.accuracy}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-[#001242] mb-2">
								Session Notes (Optional)
							</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								rows={3}
								className="w-full p-3 border border-[#E8F4F8] rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent"
								placeholder="What did you study? Any challenges or breakthroughs?"
							/>
						</div>

						{/* Session Summary */}
						<div className="p-4 bg-[#E8F4F8] rounded-lg">
							<h4 className="font-medium text-[#001242] mb-2">
								Session Summary
							</h4>
							<div className="text-sm text-[#005E7C] space-y-1">
								<p>
									<strong>Date:</strong> {new Date(date).toLocaleDateString()}
								</p>
								<p>
									<strong>Duration:</strong> {duration} minutes
								</p>
								<p>
									<strong>Questions:</strong> {questionsAnswered} answered
								</p>
								<p>
									<strong>Accuracy:</strong> {accuracy}%
								</p>
								<p>
									<strong>Efficiency:</strong>{" "}
									{Math.round((questionsAnswered / duration) * 60)}{" "}
									questions/hour
								</p>
							</div>
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<button
								type="button"
								onClick={onCancel}
								className="px-4 py-2 text-[#005E7C] hover:text-[#000022] transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="bg-[#0094C6] text-white px-6 py-2 rounded-lg hover:bg-[#001242] transition-colors"
							>
								Log Session
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
