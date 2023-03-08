# Dataverse Frontend

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![Tests](https://github.com/IQSS/dataverse-frontend/actions/workflows/test.yml/badge.svg)](https://github.com/IQSS/dataverse-frontend/actions/workflows/test.yml)

## Getting Started

First install node >=16 and npm >=8. Recommended versions `node v19` and `npm v9`.

### `npm install`

Run this command to install the dependencies. You may see a message about vulnerabilities after running this command. \
Please check this announcement from Create React App repository https://github.com/facebook/create-react-app/issues/11174 .
These vulnerabilities won't be in the production build since they come from libraries only used during the development.

## Available Scripts

In the project directory, you can run at any time:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner for the unit tests in the interactive watch mode.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run preview`

Locally preview the production build.

### `npm run cy:run`

Launches the Cypress test runner for the end-to-end tests. \
If you prefer to see the tests executing in cypress you can run `npm run cy:open`

### `npm run lint`

Launches the linter. To automatically fix the errors run `npm run lint:fix`

### `npm run format`

Launches the prettier formatter. We recommend you to configure your IDE to run prettier on save.

### `npm run storybook`

Runs the Storybook in the development mode.\
Open [http://localhost:6006](http://localhost:6006) to view it in your browser.
