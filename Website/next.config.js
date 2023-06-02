const withPWA = require('next-pwa')({
    dest: 'public',
    skipWaiting: true,
    register: true,
    disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
    // next.js config
    reactStrictMode: true,
    i18n: {
        locales: ['en-US', 'fr', 'nl-NL'],
        defaultLocale: 'en-US',
    },
})