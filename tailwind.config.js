/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                wisco: {
                    50: "#fff0f1",
                    100: "#ffdedf",
                    200: "#ffc2c4",
                    300: "#ff989c",
                    400: "#ff5d63",
                    500: "#ff2b33",
                    600: "#f60c15",
                    700: "#c5050c",
                    800: "#ab090f",
                    900: "#8d0f14",
                    950: "#4e0104",
                },
            },
        },
    },
    plugins: [require("tailwind-scrollbar-hide")],
};
