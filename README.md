# Dataverse Frontend

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![Tests](https://github.com/IQSS/dataverse-frontend/actions/workflows/test.yml/badge.svg)](https://github.com/IQSS/dataverse-frontend/actions/workflows/test.yml)
[![Accessibility](https://github.com/IQSS/dataverse-frontend/actions/workflows/accessibility.yml/badge.svg)](https://github.com/IQSS/dataverse-frontend/actions/workflows/accessibility.yml)
[![Unit Tests Coverage](https://coveralls.io/repos/github/IQSS/dataverse-frontend/badge.svg?branch=develop)](https://coveralls.io/github/IQSS/dataverse-frontend?branch=develop)

## Demo videos

- 2023-08-01: [View mode of the dataset page](https://groups.google.com/g/dataverse-community/c/cxZ3Bal_-uo/m/h3kh3iVNCwAJ)
- 2023-12-13: [Files table on the dataset page](https://groups.google.com/g/dataverse-community/c/w_rEMddESYc/m/6F7QC1p-AgAJ)

## Getting Started

First install node >=16 and npm >=8. Recommended versions `node v19` and `npm v9`.

### Create a `.npmrc` file and add a token

To install the [@iqss/dataverse-client-javascript](https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript)
from the GitHub registry, necessary for connecting with the Dataverse API, follow these steps to create an `.npmrc` file in
the root of your project using your GitHub token.

1. **Copy `.npmrc.example`**

   Duplicate the `.npmrc.example` file in your project and save it as `.npmrc`.

2. **Replace the Token**

   Open the newly created `.npmrc` file and replace `YOUR_GITHUB_TOKEN` with your actual GitHub token.

   ```plaintext
   legacy-peer-deps=true

    //npm.pkg.github.com/:_authToken=<YOUR_GITHUB_AUTH_TOKEN>
    @iqss:registry=https://npm.pkg.github.com/
   ```

#### How to Get a GitHub Token

If you don't have a GitHub token yet, follow these steps:

1. Go to your GitHub account settings.

2. Navigate to "Developer settings" -> "Personal access tokens."

3. Click "Personal access tokens" -> "Tokens (classic)" -> "Generate new token (classic)".

4. Give the token a name and select the "read:packages" scope.

5. Copy the generated token.

6. Replace `YOUR_GITHUB_AUTH_TOKEN` in the `.npmrc` file with the copied token.

Now, you should be able to install the Dataverse JavaScript client using npm.

### `npm install`

Run this command to install the dependencies. You may see a message about vulnerabilities after running this command. \
Please check this announcement from Create React App repository https://github.com/facebook/create-react-app/issues/11174 .
These vulnerabilities won't be in the production build since they come from libraries only used during the development.

### `cd packages/design-system && npm run build`

Run this command to build the UI library. This is needed to be able to run the app.

## Available Scripts

In the project directory, you can run at any time:

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

### `npm run test:unit`

Launches the test runner for the unit tests in the interactive watch mode.  
If you prefer to see the tests executing in cypress you can run `npm run cy:open-unit`  
You can check the coverage with `npm run test:coverage`

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run preview`

Locally preview the production build.

### `npm run test:e2e`

Launches the Cypress test runner for the end-to-end tests.  
If you prefer to see the tests executing in cypress you can run `npm run cy:open-e2e`

### `npm run lint`

Launches the linter. To automatically fix the errors run `npm run lint:fix`

### `npm run format`

Launches the prettier formatter. We recommend you to configure your IDE to run prettier on save.

### `npm run storybook`

Runs the Storybook in the development mode.

There are 2 Storybook instances, one for the Design System and one for the Dataverse Frontend.

Open [http://localhost:6006](http://localhost:6006) to view the Dataverse Frontend Storybook in your browser.  
Open [http://localhost:6007](http://localhost:6007) to view the Design System Storybook in your browser.

Note that both Storybook instances are also published to Chromatic (the Chromatic build contains
less dynamic content than the local Storybook):

- [Dataverse Frontend](https://www.chromatic.com/builds?appId=646f68aa9beb01b35c599acd)
- [Dataverse Design System](https://www.chromatic.com/builds?appId=646fbe232a8d3b501a1943f3)

### Cypress Testing Tool

The project includes [@cypress/grep](https://www.npmjs.com/package/@cypress/grep) for running specific tests.
To run the tests, use --env grep="your test name" in the command line.

To run a specific test multiple times, use --env burn=10 in the command line.
Running tests multilpe times is useful for detecting flaky tests.

For example:

`npx cypress run --spec tests/e2e-integration/e2e/sections/dataset/Dataset.spec.tsx --env grep="loads the restricted files when the user is logged in as owner",burn=10`

## Local development environment

A containerized environment, oriented to local development, is available to be run from the repository.

This environment contains a dockerized instance of the Dataverse backend with its dependent services (database, mailserver, etc), as well as an npm development server running the SPA frontend (With code autoupdating).

This environment is intended for locally testing any functionality that requires access to the Dataverse API from the SPA frontend.

There is an Nginx reverse proxy container on top of the frontend and backend containers to avoid CORS issues while testing the application.

### Run the environment

Inside the `dev-env` folder, run the following command:

```
./run-env.sh <dataverse_image_tag>
```

As the script argument, add the name of the Dataverse image tag you want to deploy.

Note that the image tag in the docker registry must to be pre pushed, otherwise the script will fail.

If you are running the script for the first time, it may take a while, since `npm install` has to install all the dependencies. This can also happen if you added new dependencies to package.json.

Once the script has finished, you will be able to access Dataverse via:

- [http://localhost:8000/spa](http://localhost:8000/spa): SPA Frontend
- [http://localhost:8000](http://localhost:8000): Dataverse Backend and JSF Frontend

_Note: The Dataverse configbaker takes some time to start the application, so the application will not be accessible until the bootstrapping is complete._

If you want to add test data (collections and datasets) to the Dataverse instance, run the following command:

```
./add-env-data.sh
```

_Note: The above command uses the dataverse-sample-data repository whose scripts occasionally fail, so some of the test data may not be added_

### Remove the environment

To clean up your environment of any running environment containers, as well as any associated data volumes, run this script inside the `dev-env` folder:

```
./rm-env
```

## Deployment

Once the site is built through the `npm run build` command, it can be deployed in different ways to different types of infrastructure, depending on installation needs.

We are working to provide different preconfigured automated deployment options, seeking to support common use cases today for installing applications of this nature.

The current automated deployment options are available within the GitHub `deploy` workflow, which is designed to be run manually from GitHub Actions. The deployment option is selected via a dropdown menu, as well as the target environment.

### AWS S3 Deployment

This option will build and deploy the application to a remote S3 bucket.

For this workflow to work, a GitHub environment must be configured with the following environment secrets:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_S3_BUCKET_NAME
- AWS_DEFAULT_REGION

Note that for the deployment to the S3 bucket to succeed, you must make the following changes to the bucket via the S3 web interface (or equivalent changes using aws-cli or similar tools):

- Under "Permissions", "Permissions overview", "Block public access (bucket settings)", click "Edit", then uncheck "Block all public access" and save.
- Under "Properties", "Static website hosting", click "Edit" and enable it. Change "Index document" and "Error document" to "index.html".
- Under "Bucket policy", click "Edit" and paste the following policy (changing `<BUCKET_NAME>` to your bucket name) and save.

```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadGetObject",
			"Principal": "*",
			"Effect": "Allow",
			"Action": [
				"s3:GetObject"
			],
			"Resource": [
				"arn:aws:s3:::<BUCKET_NAME>/*"
			]
		}
	]
}
```

You should see the deployed app at http://BUCKET-NAME.s3-website-REGION.amazonaws.com such as http://mybucket.s3-website-us-east-1.amazonaws.com

### Payara Deployment

This option will build and deploy the application to a remote Payara server.

This option is intended for an "all-in-one" solution, where the Dataverse backend application and the frontend application run on the same Payara server.

For this workflow to work, a GitHub environment must be configured with the following environment secrets:

- PAYARA_INSTANCE_HOST
- PAYARA_INSTANCE_USERNAME
- PAYARA_INSTANCE_SSH_PRIVATE_KEY

It is important that the remote instance is correctly pre-configured, with the Payara server running, and a service account for Dataverse with the corresponding SSH key pair established.

A base path for the frontend application can be established on the remote server by setting the corresponding field in the workflow inputs. This mechanism prevents conflicts between the frontend application and any pre-existing deployed application running on Payara, which can potentially be a Dataverse backend. This way, only the routes with the base path included will redirect to the frontend application.

#### Beta Testing Environment

To make the SPA Frontend accesible and testable by people interested in the project, there is a remote beta testing environment that includes the latest changes developed both for the frontend application and the Dataverse backend application (develop branches).

This environment follows the "all-in-one" solution described above, where both applications coexist on a Payara server.

Environment updates are carried out automatically through GitHub actions, present both in this repository and in the Dataverse backend repository, which deploy the develop branches when any change is pushed to them.

The environment is accessible through the following URLs:

- SPA: https://beta.dataverse.org/spa
- JSF: https://beta.dataverse.org

## Changes from the original JSF application

### Changes from the Style Guide

The design system and frontend in this repo are inspired by the Dataverse Project [Style Guide](https://guides.dataverse.org/en/latest/style/index.html), but the following changes have been made, especially for accessibility.

#### Links

We added an underline to links to make them accessible.

#### File label

Now we are using Bootstrap with a theme, so there is only one definition for the secondary color. Since Bootstrap applies
the secondary color to the labels automatically, the color of the file label is now the global secondary color which is
a lighter shade of grey than what it used to be.

We changed the citation block to be white with a colored border, to make the text in the box more accessible.

#### Breadcrumbs

We have introduced an update to the breadcrumb navigation UI. Unlike in the original JSF application, where breadcrumbs
did not reflect the user's current location within the site, our new SPA design now includes this feature in the breadcrumbs.

This update gives users a clear indication of their current position within the application's hierarchy.

### Changes in functionality behavior

Our main goal is to replicate the behavior of the original JSF application in all its functionalities, although during development we have found opportunities to review certain behaviors and apply changes where we find appropriate.

#### Dataset files tab search

The original Dataset JSF page uses Solr to search for files based on the available filters. Past dataset versions are not indexed in Solr, so the filter option is not available (hidden) for such versions. When a version is indexed, the search text is searched in Solr, and Solr grammar can be applied. When the version is not indexed, the search text is searched in the database.

The new SPA does not use Solr as the API endpoint it uses performs all queries on the database. Filters and search options are available for all versions in the same way, homogenizing behavior, although losing the possibility of using the Solr grammar.

The decision of this change is made on the assumption that Solr may not be required in the context of files tab search, whose search facets are reduced compared to other in-application searches. Therefore, if we find evidence that the assumption is incorrect, we will work on extending the search capabilities to support Solr.

## Thanks

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.
