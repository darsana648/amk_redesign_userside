/* Production build config for the Tailwind CLI (see README → Going to production).
   Theme values mirror assets/js/tailwind-config.js, which the Play CDN uses in development. */
const browser = { tailwind: {} };
require("vm").runInNewContext(
  require("fs").readFileSync(__dirname + "/assets/js/tailwind-config.js", "utf8"),
  browser
);

module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: browser.tailwind.config.theme,
};
