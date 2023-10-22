/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'distribution.faceit-cdn.net',
                port: '',
                pathname: '/images/*',
            },
        ],
    },
}

module.exports = nextConfig
