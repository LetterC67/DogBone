module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#FF00FF",
          background: "#FFFFFF",
        },
        typography: () => ({
          '--primary': "#ECECEC",
        }),
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  };
  