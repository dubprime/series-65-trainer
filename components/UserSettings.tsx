"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface UserSettings {
	theme: "light" | "dark" | "auto"
	notifications: {
		studyReminders: boolean
		goalDeadlines: boolean
		progressUpdates: boolean
	}
	studyPreferences: {
		defaultSessionSize: number
		autoStartVocab: boolean
		showExplanations: boolean
		enableSound: boolean
	}
	accessibility: {
		highContrast: boolean
		largeText: boolean
		reducedMotion: boolean
	}
}

export default function UserSettings() {
	const [settings, setSettings] = useState<UserSettings>({
		theme: "light",
		notifications: {
			studyReminders: true,
			goalDeadlines: true,
			progressUpdates: false,
		},
		studyPreferences: {
			defaultSessionSize: 5,
			autoStartVocab: true,
			showExplanations: true,
			enableSound: false,
		},
		accessibility: {
			highContrast: false,
			largeText: false,
			reducedMotion: false,
		},
	})
	const [loading, setLoading] = useState(false)
	const [saved, setSaved] = useState(false)

	useEffect(() => {
		loadSettings()
	}, [])

	async function loadSettings() {
		try {
			const supabase = createClient()
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) return

			// Load user settings from database
			const { data, error } = await supabase
				.from("user_settings")
				.select("*")
				.eq("user_id", user.id)
				.single()

			if (data && !error) {
				setSettings(data.settings)
			}
		} catch (error) {
			console.error("Error loading settings:", error)
		}
	}

	async function saveSettings() {
		setLoading(true)
		try {
			const supabase = createClient()
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) return

			// Save settings to database
			const { error } = await supabase.from("user_settings").upsert({
				user_id: user.id,
				settings,
				updated_at: new Date().toISOString(),
			})

			if (error) {
				console.error("Error saving settings:", error)
				return
			}

			setSaved(true)
			setTimeout(() => setSaved(false), 3000)
		} catch (error) {
			console.error("Error saving settings:", error)
		} finally {
			setLoading(false)
		}
	}

	function updateSettings(path: string, value: any) {
		setSettings((prev) => {
			const newSettings = { ...prev }
			const keys = path.split(".")
			let current: any = newSettings

			for (let i = 0; i < keys.length - 1; i++) {
				current = current[keys[i]]
			}

			current[keys[keys.length - 1]] = value
			return newSettings
		})
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-[#000022]">User Settings</h2>
				<button
					onClick={saveSettings}
					disabled={loading}
					className="bg-[#16A34A] text-white px-6 py-2 rounded-lg hover:bg-[#15803D] transition-colors disabled:opacity-50"
				>
					{loading ? "Saving..." : "Save Settings"}
				</button>
			</div>

			{saved && (
				<div className="bg-[#DCFCE7] border border-[#16A34A] text-[#16A34A] px-4 py-3 rounded-lg">
					✅ Settings saved successfully!
				</div>
			)}

			{/* Theme Settings */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					🎨 Appearance
				</h3>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-[#001242] mb-2">
							Theme
						</label>
						<select
							value={settings.theme}
							onChange={(e) => updateSettings("theme", e.target.value)}
							className="w-full p-3 border border-[#E8F4F8] rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent"
						>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
							<option value="auto">Auto (System)</option>
						</select>
					</div>
				</div>
			</div>

			{/* Study Preferences */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					📚 Study Preferences
				</h3>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-[#001242] mb-2">
							Default Session Size
						</label>
						<select
							value={settings.studyPreferences.defaultSessionSize}
							onChange={(e) =>
								updateSettings(
									"studyPreferences.defaultSessionSize",
									Number(e.target.value)
								)
							}
							className="w-full p-3 border border-[#E8F4F8] rounded-lg focus:ring-2 focus:ring-[#0094C6] focus:border-transparent"
						>
							<option value={3}>3 questions</option>
							<option value={5}>5 questions</option>
							<option value={10}>10 questions</option>
							<option value={15}>15 questions</option>
						</select>
					</div>

					<div className="space-y-3">
						<label className="flex items-center space-x-3">
							<input
								type="checkbox"
								checked={settings.studyPreferences.autoStartVocab}
								onChange={(e) =>
									updateSettings(
										"studyPreferences.autoStartVocab",
										e.target.checked
									)
								}
								className="w-4 h-4 text-[#0094C6] border-[#E8F4F8] rounded focus:ring-[#0094C6]"
							/>
							<span className="text-[#000022]">
								Automatically start with vocabulary review
							</span>
						</label>

						<label className="flex items-center space-x-3">
							<input
								type="checkbox"
								checked={settings.studyPreferences.showExplanations}
								onChange={(e) =>
									updateSettings(
										"studyPreferences.showExplanations",
										e.target.checked
									)
								}
								className="w-4 h-4 text-[#0094C6] border-[#E8F4F8] rounded focus:ring-[#0094C6]"
							/>
							<span className="text-[#000022]">
								Show explanations after answering
							</span>
						</label>

						<label className="flex items-center space-x-3">
							<input
								type="checkbox"
								checked={settings.studyPreferences.enableSound}
								onChange={(e) =>
									updateSettings(
										"studyPreferences.enableSound",
										e.target.checked
									)
								}
								className="w-4 h-4 text-[#0094C6] border-[#E8F4F8] rounded focus:ring-[#0094C6]"
							/>
							<span className="text-[#000022]">Enable sound effects</span>
						</label>
					</div>
				</div>
			</div>

			{/* Notifications */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					🔔 Notifications
				</h3>
				<div className="space-y-3">
					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={settings.notifications.studyReminders}
							onChange={(e) =>
								updateSettings("notifications.studyReminders", e.target.checked)
							}
							className="w-4 h-4 text-[#0094C6] border-[#E8F4F8] rounded focus:ring-[#0094C6]"
						/>
						<span className="text-[#000022]">Daily study reminders</span>
					</label>

					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={settings.notifications.goalDeadlines}
							onChange={(e) =>
								updateSettings("notifications.goalDeadlines", e.target.checked)
							}
							className="w-4 h-4 text-[#0094C6] border-[#E8F4F8] rounded focus:ring-[#0094C6]"
						/>
						<span className="text-[#000022]">Goal deadline reminders</span>
					</label>

					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={settings.notifications.progressUpdates}
							onChange={(e) =>
								updateSettings(
									"notifications.progressUpdates",
									e.target.checked
								)
							}
							className="w-4 h-4 text-[#0094C6] border-[#E8F4F8] rounded focus:ring-[#0094C6]"
						/>
						<span className="text-[#000022]">Weekly progress summaries</span>
					</label>
				</div>
			</div>

			{/* Accessibility */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					♿ Accessibility
				</h3>
				<div className="space-y-3">
					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={settings.accessibility.highContrast}
							onChange={(e) =>
								updateSettings("accessibility.highContrast", e.target.checked)
							}
							className="w-4 h-4 text-[#0094C6] border-[#E8F4F8] rounded focus:ring-[#0094C6]"
						/>
						<span className="text-[#000022]">High contrast mode</span>
					</label>

					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={settings.accessibility.largeText}
							onChange={(e) =>
								updateSettings("accessibility.largeText", e.target.checked)
							}
							className="w-4 h-4 text-[#0094C6] border-[#E8F4F8] rounded focus:ring-[#0094C6]"
						/>
						<span className="text-[#000022]">Large text</span>
					</label>

					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={settings.accessibility.reducedMotion}
							onChange={(e) =>
								updateSettings("accessibility.reducedMotion", e.target.checked)
							}
							className="w-4 h-4 text-[#0094C6] border-[#E8F4F8] rounded focus:ring-[#0094C6]"
						/>
						<span className="text-[#000022]">Reduce motion</span>
					</label>
				</div>
			</div>

			{/* Data Management */}
			<div className="bg-white rounded-lg shadow-sm border border-[#E8F4F8] p-6">
				<h3 className="text-lg font-semibold text-[#000022] mb-4">
					🗄️ Data Management
				</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 bg-[#F8FBFC] rounded-lg">
						<div>
							<h4 className="font-medium text-[#000022]">Export Study Data</h4>
							<p className="text-sm text-[#005E7C]">
								Download your progress and study history
							</p>
						</div>
						<button className="bg-[#0094C6] text-white px-4 py-2 rounded-lg hover:bg-[#001242] transition-colors">
							Export
						</button>
					</div>

					<div className="flex items-center justify-between p-4 bg-[#FEF3C7] rounded-lg">
						<div>
							<h4 className="font-medium text-[#000022]">Reset Progress</h4>
							<p className="text-sm text-[#005E7C]">
								Clear all study data and start fresh
							</p>
						</div>
						<button className="bg-[#DC2626] text-white px-4 py-2 rounded-lg hover:bg-[#B91C1C] transition-colors">
							Reset
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
