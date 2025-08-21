"use client"

import { useState } from "react"

interface HelpSection {
	id: string
	title: string
	content: string
	icon: string
}

const helpSections: HelpSection[] = [
	{
		id: "getting-started",
		title: "Getting Started",
		icon: "🚀",
		content: `
			<h3>Welcome to Series 65 Study Platform!</h3>
			<p>Here's how to get started:</p>
			<ol>
				<li><strong>Review Vocabulary:</strong> Start with key concepts and definitions</li>
				<li><strong>Practice Questions:</strong> Answer questions to test your knowledge</li>
				<li><strong>Track Progress:</strong> Monitor your performance and improvement</li>
				<li><strong>Set Goals:</strong> Create study targets to stay motivated</li>
			</ol>
			<p>Begin with the vocabulary review to build a strong foundation!</p>
		`,
	},
	{
		id: "vocab-teaching",
		title: "Vocabulary Learning",
		icon: "📚",
		content: `
			<h3>How Vocabulary Learning Works</h3>
			<p>The vocabulary system helps you understand key concepts before answering questions:</p>
			<ul>
				<li><strong>Concept Review:</strong> Read through important terms and definitions</li>
				<li><strong>Examples:</strong> See real-world applications of concepts</li>
				<li><strong>Progressive Learning:</strong> Move through concepts at your own pace</li>
				<li><strong>Skip Option:</strong> Skip concepts you already know well</li>
			</ul>
			<p>Take your time to understand each concept - it will help with question accuracy!</p>
		`,
	},
	{
		id: "question-system",
		title: "Question System",
		icon: "❓",
		content: `
			<h3>How the Question System Works</h3>
			<p>Our intelligent question system adapts to your learning needs:</p>
			<ul>
				<li><strong>Submit Answers:</strong> Choose your answer, then click "Submit Answer"</li>
				<li><strong>Immediate Feedback:</strong> See if you're correct and get explanations</li>
				<li><strong>Progress Tracking:</strong> Monitor your performance across sessions</li>
				<li><strong>Session Management:</strong> Track study time and completion</li>
			</ul>
			<p>Remember: You must submit your answer to see the result!</p>
		`,
	},
	{
		id: "spaced-repetition",
		title: "Spaced Repetition",
		icon: "🧠",
		content: `
			<h3>Understanding Spaced Repetition</h3>
			<p>Our algorithm helps you learn more efficiently:</p>
			<ul>
				<li><strong>Smart Scheduling:</strong> Questions appear when you need to review them most</li>
				<li><strong>Performance-Based:</strong> Correct answers increase intervals, incorrect ones decrease them</li>
				<li><strong>Adaptive Difficulty:</strong> System adjusts based on your accuracy</li>
				<li><strong>Session Types:</strong> Choose from adaptive, weak areas, mixed difficulty, or category focus</li>
			</ul>
			<p>This scientifically-proven method maximizes long-term retention!</p>
		`,
	},
	{
		id: "goal-setting",
		title: "Goal Setting",
		icon: "🎯",
		content: `
			<h3>Setting and Achieving Study Goals</h3>
			<p>Goals help you stay focused and motivated:</p>
			<ul>
				<li><strong>Specific Targets:</strong> Set accuracy and question count goals</li>
				<li><strong>Deadlines:</strong> Create time-bound objectives</li>
				<li><strong>Progress Tracking:</strong> Visual progress bars show your advancement</li>
				<li><strong>Flexible Adjustments:</strong> Modify goals as your needs change</li>
			</ul>
			<p>Start with achievable goals and gradually increase difficulty!</p>
		`,
	},
	{
		id: "analytics",
		title: "Performance Analytics",
		icon: "📊",
		content: `
			<h3>Understanding Your Performance</h3>
			<p>Analytics provide insights into your learning journey:</p>
			<ul>
				<li><strong>Overall Accuracy:</strong> Track your success rate across all questions</li>
				<li><strong>Category Performance:</strong> Identify strong and weak areas</li>
				<li><strong>Progress Trends:</strong> See improvement over time</li>
				<li><strong>Study Recommendations:</strong> Get personalized suggestions</li>
			</ul>
			<p>Use these insights to focus your study efforts effectively!</p>
		`,
	},
	{
		id: "study-sessions",
		title: "Study Sessions",
		icon: "⏰",
		content: `
			<h3>Managing Study Sessions</h3>
			<p>Organize your study time effectively:</p>
			<ul>
				<li><strong>Session Planning:</strong> Use the planner to select optimal questions</li>
				<li><strong>Time Tracking:</strong> Monitor how long you study</li>
				<li><strong>Session Logging:</strong> Record your study activities</li>
				<li><strong>Progress Review:</strong> Analyze session performance</li>
			</ul>
			<p>Consistent, focused study sessions lead to better results!</p>
		`,
	},
]

export default function HelpOnboarding() {
	const [activeSection, setActiveSection] = useState<string>("getting-started")
	const [showOnboarding, setShowOnboarding] = useState(false)

	function getActiveContent() {
		return (
			helpSections.find((section) => section.id === activeSection)?.content ||
			""
		)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-[#000022]">Help & Onboarding</h2>
				<button
					onClick={() => setShowOnboarding(true)}
					className="bg-[#0094C6] text-white px-4 py-2 rounded-lg hover:bg-[#001242] transition-colors"
				>
					🎬 Start Tour
				</button>
			</div>

			{/* Help Navigation */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					📖 Help Topics
				</h3>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					{helpSections.map((section) => (
						<button
							key={section.id}
							onClick={() => setActiveSection(section.id)}
							className={`p-4 rounded-lg border transition-all text-left ${
								activeSection === section.id
									? "border-[#0094C6] bg-[#E8F4F8] text-[#000022]"
									: "border-[#E8F4F8] hover:border-[#0094C6] hover:bg-[#F8FBFC]"
							}`}
						>
							<div className="text-2xl mb-2">{section.icon}</div>
							<div className="font-medium">{section.title}</div>
						</button>
					))}
				</div>
			</div>

			{/* Help Content */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<div
					className="prose prose-lg max-w-none"
					dangerouslySetInnerHTML={{ __html: getActiveContent() }}
				/>
			</div>

			{/* Quick Tips */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					💡 Quick Tips
				</h3>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="p-4 bg-[#E8F4F8] rounded-lg">
						<h4 className="font-medium text-[#001242] mb-2">
							🎯 Study Regularly
						</h4>
						<p className="text-sm text-[#005E7C]">
							Short, daily study sessions are more effective than long,
							infrequent ones.
						</p>
					</div>
					<div className="p-4 bg-[#E8F4F8] rounded-lg">
						<h4 className="font-medium text-[#001242] mb-2">
							📚 Use Vocabulary First
						</h4>
						<p className="text-sm text-[#005E7C]">
							Always review key concepts before starting practice questions.
						</p>
					</div>
					<div className="p-4 bg-[#E8F4F8] rounded-lg">
						<h4 className="font-medium text-[#001242] mb-2">
							🔄 Review Wrong Answers
						</h4>
						<p className="text-sm text-[#005E7C]">
							Focus on questions you got wrong to improve weak areas.
						</p>
					</div>
					<div className="p-4 bg-[#E8F4F8] rounded-lg">
						<h4 className="font-medium text-[#001242] mb-2">
							📊 Track Progress
						</h4>
						<p className="text-sm text-[#005E7C]">
							Monitor your analytics to see improvement over time.
						</p>
					</div>
				</div>
			</div>

			{/* Contact Support */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					🆘 Need More Help?
				</h3>
				<div className="text-center">
					<p className="text-[#005E7C] mb-4">
						Can't find what you're looking for? We're here to help!
					</p>
					<div className="space-x-4">
						<button className="bg-[#0094C6] text-white px-6 py-2 rounded-lg hover:bg-[#001242] transition-colors">
							📧 Contact Support
						</button>
						<button className="bg-[#16A34A] text-white px-6 py-2 rounded-lg hover:bg-[#15803D] transition-colors">
							📖 User Manual
						</button>
					</div>
				</div>
			</div>

			{/* Onboarding Modal */}
			{showOnboarding && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-xl font-semibold text-[#000022] mb-4">
								🎬 Welcome Tour
							</h2>
							<div className="space-y-4 text-[#005E7C]">
								<p>
									Welcome to the Series 65 Study Platform! This quick tour will
									show you around.
								</p>
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<span className="text-[#16A34A]">✅</span>
										<span>
											Dashboard - Your study overview and quick actions
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="text-[#16A34A]">✅</span>
										<span>
											Questions - Practice with intelligent question selection
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="text-[#16A34A]">✅</span>
										<span>Analytics - Track your performance and progress</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="text-[#16A34A]">✅</span>
										<span>Study Manager - Set goals and plan sessions</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="text-[#16A34A]">✅</span>
										<span>Settings - Customize your experience</span>
									</div>
								</div>
								<p className="text-sm">
									Ready to start studying? Begin with the vocabulary review to
									build a strong foundation!
								</p>
							</div>
							<div className="mt-6 text-center">
								<button
									onClick={() => setShowOnboarding(false)}
									className="bg-[#16A34A] text-white px-6 py-2 rounded-lg hover:bg-[#15803D] transition-colors"
								>
									🚀 Let's Start!
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
