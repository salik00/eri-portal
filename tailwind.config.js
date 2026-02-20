/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'oxford-blue': '#002147',
                'oxford-blue-light': '#0a3a6b',
                'oxford-blue-dark': '#001530',
                'gold': '#C5A059',
                'gold-light': '#d4b47a',
                'gold-dark': '#a07d3a',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                serif: ['var(--font-playfair)', 'Georgia', 'serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-gold': 'pulseGold 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                pulseGold: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(197, 160, 89, 0.4)' },
                    '50%': { boxShadow: '0 0 0 10px rgba(197, 160, 89, 0)' },
                },
            },
            backgroundImage: {
                'gradient-gold': 'linear-gradient(135deg, #C5A059 0%, #d4b47a 50%, #a07d3a 100%)',
                'gradient-oxford': 'linear-gradient(135deg, #001530 0%, #002147 50%, #0a3a6b 100%)',
            },
        },
    },
    plugins: [],
}
