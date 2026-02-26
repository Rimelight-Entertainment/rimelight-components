module.exports = {
  vueFiles: "./{app,shared,server,playground}/**/*.?(js|vue|ts)",
  languageFiles: "./i18n/locales/*.?(json|yaml|yml|js)",
  exclude: [],
  output: false,
  add: false,
  remove: false,
  ci: false,
  separator: ".",
  noEmptyTranslation: "",
};
