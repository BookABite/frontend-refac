import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'res.cloudinary.com',
            },
            {
                hostname: 'flagcdn.com',
            },
        ],
    },
    experimental: {
        forceSwcTransforms: true,
    },
}

export default nextConfig
