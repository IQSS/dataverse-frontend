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

## Deployment

Once the site is built through the `npm run build` command, it can be deployed in different ways to different types of infrastructure, depending on installation needs.

We are working to provide different preconfigured automated deployment options, seeking to support common use cases today for installing applications of this nature.

### AWS S3 Deployment

AWS S3 deployment is done via the GitHub workflow `deploy`, which is run manually from GitHub Actions and will build and deploy the application to a remote S3 bucket.

For this workflow to work, a GitHub environment must be first created with the following environment secrets:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_S3_BUCKET_NAME
- AWS_DEFAULT_REGION

Selecting the `deploy` workflow in GitHub Actions will display the available environments for deployment in a drop-down menu.

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
