import * as browserify from "@cypress/browserify-preprocessor";
import { preprocessor } from "@badeball/cypress-cucumber-preprocessor/browserify";
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): void => {
  const options = {
    ...browserify.defaultOptions,
    typescript: require.resolve("typescript"),
  };

  on("file:preprocessor", preprocessor(config, options));

  allureWriter(on, config);
};
