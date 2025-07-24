/** @type {import('next').NextConfig} */
const nextConfig = {
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
