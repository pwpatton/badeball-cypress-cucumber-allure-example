# Installation

- npm install
- npm run cy:open

--- 

# Steps I used to create this project

See [badeball quickstart doc](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/quick-start.md)


initialize project

    npm init 
    
    // take all defaults

Install badeball/cucumber

From [badeball quick-start guide](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/quick-start.md)

    npm install @badeball/cypress-cucumber-preprocessor

Configure testFiles

    Configure testFiles with "**/*.feature", using EG. cypress.json.

    {
        "testFiles": "**/*.feature"
    }


#Configure your preferred bundler to process features files

see [browserify example](https://github.com/badeball/cypress-cucumber-preprocessor/tree/master/examples/browserify)

Install required modules

    npm i @cypress/browserify-preprocessor
    npm i cypress
    npm i typescript

Run cypress open to get cypress directory structure

    cypress open

Configure plugin in cypress/plugins/index.ts
 
Rename index.js to index.ts

 ```typescript
import * as browserify from "@cypress/browserify-preprocessor";
import { preprocessor } from "@badeball/cypress-cucumber-preprocessor/browserify";

export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): void => {
  on(
    "file:preprocessor",
    preprocessor(config, {
      ...browserify.defaultOptions,
      typescript: require.resolve("typescript"),
    })
  );
};
```

# Put the example test into place

Add duckduckgo.feature to cypress/integration folder
```gherkin
Feature: duckduckgo.com
  Scenario: visting the frontpage
    When I visit duckduckgo.com
    Then I should see a search bar
```
Add duckduckgo.ts to cypress/integration folder
```typescript
import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I visit duckduckgo.com", () => {
  cy.visit("https://duckduckgo.com/");
});

Then("I should see a search bar", () => {
  cy.get("input").should(
    "have.attr",
    "placeholder",
    "Search the web without being tracked"
  );

  assert.deepEqual({}, {});
});
```

#Run the example test

    cypress open
    click on duckduckgo.feature

    ![cypress-open.png](img.png)

See the test results

    ![cypress-test.png](img.png)

The test ran and everything looks good!

---
Add a couple more examples, so it's not just one test running

    see integration directory

---

# Add in tsconfig.json to get rid of type errors in cypress/plugins/index.ts
see ./tsconfig.json

```typescript
{
  "compilerOptions": {
    "target": "es2018",
    "lib": ["es2018", "dom"],
    "moduleResolution": "Node",
    "types": [
      "cypress-cucumber-preprocessor/steps",
      "cypress",
      "node"
    ]
  },
  "include": [
    "**/*.ts"
  ]
}
```
---
#Change the location of the step_definitions
See [step-definitions.md](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/step-definitions.md)

Move duckduckgo.ts to cypress/support/step_definitions
1. Create a `step_definitions` directory under `cypress/support`
2. Create a `duckduckgo` directory under `cypress/support/step_definitions`
3. Move `duckduckgo.ts` to `cypress/support/step_definitions`
4. run `cypress open` and click on `duckduckgo.feature`

---

# Add reporting using cypress-allure plugin
Install cypress-allure-plugin, multi-reporters and allure-commandline

    npm i @shelex/cypress-allure-plugin
    npm i allure-commandline
    npm i cypress-multi-reporters

Configure the cypress-allure-plugin in cypress/plugins/index.ts
- change signature to return `Cypress.PluginConfigOptions`
- add `allureWriter(on, config);` after the preprocessor
- return config;

```typescript
import * as browserify from "@cypress/browserify-preprocessor";
import { preprocessor } from "@badeball/cypress-cucumber-preprocessor/browserify";
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Cypress.PluginConfigOptions => {
  const options = {
    ...browserify.defaultOptions,
    typescript: require.resolve("typescript"),
  };

  on("file:preprocessor", preprocessor(config, options));

  allureWriter(on, config);

  return config;
};
```

Add import to cypress/support/index.ts

```typescript
import './commands'
import '@shelex/cypress-allure-plugin';

```

Change cypress.json to turn on the allure reporter

```typescript
{
  "env": {
    "allure": true,
    "allureLogCypress": true,
    "allureLogGherkin": true,
    "allureClearSkippedTests": true
  },

  "testFiles": "**/*.feature"
}
```

Getting a runtime failure that stops the test from completing and allure-results from being generated.
- In the browser run the cypress test
- open the developer window 
- see this stacktrace in the console.

```javascript
Uncaught TypeError: The following error originated from your application code, not from Cypress. It was caused by an unhandled promise rejection.

  > Cannot read properties of undefined (reading 'keyword')

When Cypress detects uncaught errors originating from your application it will automatically fail the current test.

This behavior is configurable, and you can choose to turn this off by listening to the `uncaught:exception` event.
    at CucumberHandler.checkLinksInExamplesTable (https://duckduckgo.com/__cypress/tests?p=cypress\support\index.ts:1862:43)
    at Runner.eval (https://duckduckgo.com/__cypress/tests?p=cypress\support\index.ts:2878:39)
From previous event:
    at onNext (https://duckduckgo.com/__cypress/runner/cypress_runner.js:185685:19)
    at done (https://duckduckgo.com/__cypress/runner/cypress_runner.js:129431:5)
    at https://duckduckgo.com/__cypress/runner/cypress_runner.js:129496:11
From previous event:
    at callFn (https://duckduckgo.com/__cypress/runner/cypress_runner.js:129494:14)
    at Test.../driver/node_modules/mocha/lib/runnable.js.Runnable.run (https://duckduckgo.com/__cypress/runner/cypress_runner.js:129478:7)
    at https://duckduckgo.com/__cypress/runner/cypress_runner.js:185755:30
From previous event:
    at Object.onRunnableRun (https://duckduckgo.com/__cypress/runner/cypress_runner.js:185740:19)
    at $Cypress.action (https://duckduckgo.com/__cypress/runner/cypress_runner.js:174847:28)
    at Test.Runnable.run (https://duckduckgo.com/__cypress/runner/cypress_runner.js:183404:13)
    at Runner.../driver/node_modules/mocha/lib/runner.js.Runner.runTest (https://duckduckgo.com/__cypress/runner/cypress_runner.js:130150:10)
    at https://duckduckgo.com/__cypress/runner/cypress_runner.js:130276:12
    at next (https://duckduckgo.com/__cypress/runner/cypress_runner.js:130059:14)
    at https://duckduckgo.com/__cypress/runner/cypress_runner.js:130069:7
    at next (https://duckduckgo.com/__cypress/runner/cypress_runner.js:129971:14)
    at https://duckduckgo.com/__cypress/runner/cypress_runner.js:130037:5
    at timeslice (https://duckduckgo.com/__cypress/runner/cypress_runner.js:123963:27)
```

