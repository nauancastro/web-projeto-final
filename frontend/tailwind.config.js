/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts}",  // Garante que Tailwind analise APENAS o front-end
    "./index.html"  // Inclui o HTML principal na raiz do projeto
  ],
  theme: {
    extend: {
      backgroundImage: {
        /**"home": "url('src/assets/bg.jpg')", */
      },
    },
  },
  plugins: [],
};
