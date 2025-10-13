const config = {
  arrowParens: "always",
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "none",
  plugins: ["@prettier/plugin-oxc", "prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/runtime/css/main.css"
}

export default config
