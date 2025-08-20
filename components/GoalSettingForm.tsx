import { useState } from "react"

interface GoalSettingFormProps {
	onSave: (goal: {
		title: string
		description: string
		targetAccuracy: number
		targetQuestions: number
		deadline: Date
	}) => void
	onCancel: () => void
}

export default function GoalSettingForm({
	onSave,
	onCancel,
}: GoalSettingFormProps) {
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [targetAccuracy, setTargetAccuracy] = useState(80)
	const [targetQuestions, setTargetQuestions] = useState(50)
	const [deadline, setDeadline] = useState("")
	const [errors, setErrors] = useState<Record<string, string>>({})

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {}

		if (!title.trim()) {
			newErrors.title = "Title is required"
		}

		if (!description.trim()) {
			newErrors.description = "Description is required"
		}

		if (targetAccuracy < 50 || targetAccuracy > 100) {
			newErrors.targetAccuracy = "Target accuracy must be between 50% and 100%"
		}

		if (targetQuestions < 10 || targetQuestions > 1000) {
			newErrors.targetQuestions = "Target questions must be between 10 and 1000"
		}

		if (!deadline) {
			newErrors.deadline = "Deadline is required"
		} else {
			const selectedDate = new Date(deadline)
			const today = new Date()
			today.setHours(0, 0, 0, 0)

			if (selectedDate <= today) {
				newErrors.deadline = "Deadline must be in the future"
			}
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
			title: title.trim(),
			description: description.trim(),
			targetAccuracy,
			targetQuestions,
			deadline: new Date(deadline),
		})
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					<h2 className="text-xl font-semibold text-[#000022] mb-4">
						Set Study Goal
					</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-[#001242] mb-2">
								Goal Title *
							</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent ${
									errors.title ? "border-[#DC2626]" : "border-[#E8F4F8]"
								}`}
								placeholder="e.g., Master Regulatory Concepts"
							/>
							{errors.title && (
								<p className="text-[#DC2626] text-sm mt-1">{errors.title}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-[#001242] mb-2">
								Description *
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent ${
									errors.description ? "border-[#DC2626]" : "border-[#E8F4F8]"
								}`}
								placeholder="Describe what you want to achieve..."
							/>
							{errors.description && (
								<p className="text-[#DC2626] text-sm mt-1">
									{errors.description}
								</p>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-[#001242] mb-2">
									Target Accuracy (%) *
								</label>
								<input
									type="number"
									value={targetAccuracy}
									onChange={(e) => setTargetAccuracy(Number(e.target.value))}
									min="50"
									max="100"
									className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent ${
										errors.targetAccuracy
											? "border-[#DC2626]"
											: "border-[#E8F4F8]"
									}`}
								/>
								{errors.targetAccuracy && (
									<p className="text-[#DC2626] text-sm mt-1">
										{errors.targetAccuracy}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-[#001242] mb-2">
									Target Questions *
								</label>
								<input
									type="number"
									value={targetQuestions}
									onChange={(e) => setTargetQuestions(Number(e.target.value))}
									min="10"
									max="1000"
									className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent ${
										errors.targetQuestions
											? "border-[#DC2626]"
											: "border-[#E8F4F8]"
									}`}
								/>
								{errors.targetQuestions && (
									<p className="text-[#DC2626] text-sm mt-1">
										{errors.targetQuestions}
									</p>
								)}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-[#001242] mb-2">
								Deadline *
							</label>
							<input
								type="date"
								value={deadline}
								onChange={(e) => setDeadline(e.target.value)}
								min={new Date().toISOString().split("T")[0]}
								className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent ${
									errors.deadline ? "border-[#DC2626]" : "border-[#E8F4F8]"
								}`}
							/>
							{errors.deadline && (
								<p className="text-[#DC2626] text-sm mt-1">{errors.deadline}</p>
							)}
						</div>

						{/* Goal Preview */}
						{title && description && (
							<div className="p-4 bg-[#E8F4F8] rounded-lg">
								<h4 className="font-medium text-[#001242] mb-2">
									Goal Preview
								</h4>
								<div className="text-sm text-[#005E7C] space-y-1">
									<p>
										<strong>Title:</strong> {title}
									</p>
									<p>
										<strong>Description:</strong> {description}
									</p>
									<p>
										<strong>Target:</strong> {targetAccuracy}% accuracy on{" "}
										{targetQuestions} questions
									</p>
									{deadline && (
										<p>
											<strong>Deadline:</strong>{" "}
											{new Date(deadline).toLocaleDateString()}
										</p>
									)}
								</div>
							</div>
						)}

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
								className="bg-[#16A34A] text-white px-6 py-2 rounded-lg hover:bg-[#15803D] transition-colors"
							>
								Save Goal
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
