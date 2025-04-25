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
}

export default nextConfig
