module.exports = {
  mode: 'jit',
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // purge: [
  //   './*.html',
  //   './src/**/*.{js,jsx,ts,tsx,vue}',
  // ],
  theme: {
    extend: {},
  },
  plugins: [],
};
