export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                glow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(15, 23, 42, 0.45)',
            },
            fontFamily: {
                display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                drift: {
                    '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
                    '50%': { transform: 'translate3d(0, -8px, 0)' },
                },
                rise: {
                    '0%': { opacity: '0', transform: 'translate3d(0, 16px, 0)' },
                    '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
                },
            },
            animation: {
                drift: 'drift 7s ease-in-out infinite',
                rise: 'rise 420ms ease-out both',
            },
        },
    },
    plugins: [],
};
