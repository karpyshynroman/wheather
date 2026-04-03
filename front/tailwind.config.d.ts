declare const _default: {
    content: string[];
    theme: {
        extend: {
            boxShadow: {
                glow: string;
            };
            fontFamily: {
                display: [string, string, string, string];
                sans: [string, string, string, string];
            };
            keyframes: {
                drift: {
                    '0%, 100%': {
                        transform: string;
                    };
                    '50%': {
                        transform: string;
                    };
                };
                rise: {
                    '0%': {
                        opacity: string;
                        transform: string;
                    };
                    '100%': {
                        opacity: string;
                        transform: string;
                    };
                };
            };
            animation: {
                drift: string;
                rise: string;
            };
        };
    };
    plugins: never[];
};
export default _default;
