/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        TOKEN_KEY: process.env.TOKEN_KEY,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
    }
}

module.exports = nextConfig
