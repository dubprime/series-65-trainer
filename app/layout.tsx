import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/contexts/AuthContext"
import Navigation from "@/components/Navigation"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Theme Train - Series 65 Study App",
	description: "Interactive study app for Series 65 exam preparation",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#E8F4F8]`}
			>
				<AuthProvider>
					<Navigation />
					<main className="min-h-screen">{children}</main>
				</AuthProvider>
			</body>
		</html>
	)
}
