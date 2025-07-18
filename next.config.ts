import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true, // Disable optimization globally
		domains: [
			'picsum.photos',
			'greenteam-bucket-2025.s3.us-east-2.amazonaws.com',
			'lh3.googleusercontent.com',
			'lh3.googleusercontent.com',
			'example.com',
			'images.remotePatterns',
			'*',
		],
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: '/api/:path*',
			},
		];
	},
};

export default withNextIntl(nextConfig);
