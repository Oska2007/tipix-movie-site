/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
            colors: {
        bg: '#050505',        // ලෝගෝ එකේ තියෙන තද කළු පාට
        panel: '#111318',     // පැනල් වලට
        primary: '#0052cc',   // තද නිල් පාට
        accent: '#0084ff',    // ලෝගෝ එකේ තියෙන දීප්තිමත් නිල් පාට
        text: '#f3f4f6',
        muted: '#9ca3af',
      },
    },
  },
  plugins: [],
};