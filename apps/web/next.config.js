/** @type {import('next').NextConfig} */
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const connectSrcExtra = backendUrl ? ` ${backendUrl}` : "";

const nextConfig = {
	async headers() {
		return [
			{
				source: "/:path*",
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
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "Content-Security-Policy",
						value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://lh3.googleusercontent.com data:; font-src 'self' data:; connect-src 'self' https://*.supabase.co http://localhost:*${connectSrcExtra};`,
					},
				],
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	typescript: {
		// Ignore TypeScript errors during build (temporary fix for monorepo issue)
		ignoreBuildErrors: true,
	},
	eslint: {
		// Ignore ESLint errors during build
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
