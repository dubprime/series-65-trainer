/** @type {import('next').NextConfig} */
const nextConfig = {
	// Turbopack is enabled via command line flag in development
	// No need to configure it in next.config.js
	images: {
		domains: ["localhost", "127.0.0.1"],
		// Add your production domains here when deploying
	},
	env: {
		CUSTOM_KEY: process.env.CUSTOM_KEY,
	},
	// Optimize for production
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	// Enable static optimization
	output: "standalone",
	// Security headers
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
				],
			},
		]
	},
}

module.exports = nextConfig
