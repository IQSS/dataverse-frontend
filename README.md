<!-- Badges here! -->

<!-- NEW DOCS START -->

<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Coverage][coverage-shield]][coverage-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url] -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="#">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">Dataverse Frontend</h3>
  <p align="center">
    <em>A New Way To Create and View Datasets &amp; Collections!</em>
    <br />
    <a href="https://guides.dataverse.org/en/latest/user/index.html"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://beta.dataverse.org/spa">View Demo (BETA)</a>·
    <a href="https://github.com/IQSS/dataverse-frontend/issues">Report Bug</a>·
    <a href="https://github.com/IQSS/dataverse-frontend/issues">Request Feature</a>.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#demo-videos">Demo Videos</a></li>
        <li><a href="#what-is-dataverse">What is Dataverse?</a></li>
        <li><a href="#what-is-dataverse-frontend">What is Dataverse Frontend & How do they differ?</a></li>
        <li><a href="#beta-testing-environemtn">Beta Testing Environment</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation-setup">Installation & Setup</a></li>
        <li><a href="#running-the-project-locally">Running the Project Locally</a></li>
      </ul>
    </li>
    <li><a href="#deployment">Deployment</a>
      <ul>
        <li><a href="#examples-for-aws-and-payara">Examples for AWS and Payara</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#components">Components</a></li>
    <li><a href="#code">Code</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

<!-- Link to demo -->

---

### Demo videos

- [Dataset Page General Overview](https://groups.google.com/g/dataverse-community/c/cxZ3Bal_-uo/m/h3kh3iVNCwAJ) (August, 2023)
- [Dataset Page Files Table](https://groups.google.com/g/dataverse-community/c/w_rEMddESYc/m/6F7QC1p-AgAJ) (December, 2023)

### What is Dataverse?

The Dataverse Project is an open source web application to share, preserve, cite, explore, and analyze research data. It facilitates making data available to others, and allows you to replicate others' work more easily. Researchers, journals, data authors, publishers, data distributors, and affiliated institutions all receive academic credit and web visibility. Read more on the [![Dataverse Website][dataverse-web-link]](https://dataverse.org/about)

### What is Dataverse Frontend?
_&amp; How do they differ?_

The Dataverse Frontend repository is an initiative undertaken in 2023 to modernize the UI and design of the Dataverse Project by creating a stand-alone interface to allow users and organizations to implement their own Dataverse installations and utilize the JavaScript framework of their choice.

**The goals of Dataverse Frontend:**

- Modernize the application
- Separate the frontend and backend logic, transition away from Monolithic Architecture
- Reimagine the current Dataverse backend as a headess API-first instance.
- The Dataverse Frontend becomes a stand-alone SPA (Single Page Application)
- Modularize the UI to allow third-party extension of the base project
- Increase cadence of development, decrease time between release cycles to implement new features
- Introduce testing automation
- Give priority and transparency to coding and design to support Harvard University's commitment to ensuring the highest standards for Accessibility Compliance
- Empower the community to create, contribute, and improve.

**New Features:**

- Node Application using ReactJS for the project baseline
- Native localization support through the i18n library
- Accessibility compliant code built from the ground-up
- Improved modularity via Web Components
- Cypress testing automation
- Storybook for UI Component Library


### Beta Testing Environment

_Track our progress and compare it to the current Dataverse application!_

To make the SPA Frontend accesible and testable by people interested in the project, there is a remote beta testing environment that includes the latest changes developed both for the frontend application and the Dataverse backend application (develop branches).

This environment follows the "all-in-one" solution described above, where both applications coexist on a Payara server.

Environment updates are carried out automatically through GitHub actions, present both in this repository and in the Dataverse backend repository, which deploy the develop branches when any change is pushed to them.

The environment is accessible through the following URLs:

 - Dataverse Frontend SPA: [beta.dataverse.org/spa](https://beta.dataverse.org/spa)
 - Dataverse JSF: [beta.dataverse.org](https://beta.dataverse.org)


### How existing Dataverse installations may be affected

- The existing Dataverse API will be added to and extended from the present backend architecture while the existing UI and current Dataverse functionalities are preserved.
- The SPA will continue its life as a separate application, supported on its own maintenance schedule.
- When the SPA has matured enough for an official release, we will switch to the new version and the old backend (Link to repository) will be moved into maintenance mode with no new features being introduced and focusing only on critical bugfixes.

#### Changes from the original Dataverse JSF application

<details>
<summary>Expand</summary>

##### Changes from the Style Guide

The design system and frontend in this repo are inspired by the Dataverse Project [Style Guide](https://guides.dataverse.org/en/latest/style/index.html), but the following changes have been made, especially for accessibility.

###### Links

We added an underline to links to make them accessible.

###### File label

Now we are using Bootstrap with a theme, so there is only one definition for the secondary color. Since Bootstrap applies
the secondary color to the labels automatically, the color of the file label is now the global secondary color which is
a lighter shade of grey than what it used to be.

We changed the citation block to be white with a colored border, to make the text in the box more accessible.

##### Changes in functionality behavior

Our main goal is to replicate the behavior of the original JSF application in all its functionalities, although during development we have found opportunities to review certain behaviors and apply changes where we find appropriate.

###### Dataset files tab search

The original Dataset JSF page uses Solr to search for files based on the available filters. Past dataset versions are not indexed in Solr, so the filter option is not available (hidden) for such versions. When a version is indexed, the search text is searched in Solr, and Solr grammar can be applied. When the version is not indexed, the search text is searched in the database.

The new SPA does not use Solr as the API endpoint it uses performs all queries on the database. Filters and search options are available for all versions in the same way, homogenizing behavior, although losing the possibility of using the Solr grammar.

The decision of this change is made on the assumption that Solr may not be required in the context of files tab search, whose search facets are reduced compared to other in-application searches. Therefore, if we find evidence that the assumption is incorrect, we will work on extending the search capabilities to support Solr.

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

<!-- TODO:  -->

_To get a local copy up and running follow these simple example steps._

### Prerequisites
[![DockerDesktop][DockerDesktop-badge]][DockerDesktop-url]

1. Node **node >=16** and NPM **npm >=8**. Recommended versions for this project are `node v19` and `npm v9`.
2. Docker! We use Docker Desktop, but the Docker CLI will also work!
3. Add your NPM and GitHub Tokens. In order to connect with the Dataverse API, develoeprs will need to install [@iqss/dataverse-client-javascript](https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript) from the GitHub registry by following the steps outlined below:
4. Navigate to the project directory root and duplicate the `.npmrc.example` file, saving the copy as `.npmrc`.
    >   ```sh
    >   # root project directory
    >   cp .npmrc.example .npmrc
    >   ```
5. Follow the steps outlined below to generate a personal access token used to interface with the GitHub API. Read more about access tokens on [GitHub Docs](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)

    >  __Getting a GitHub token__
    >  1. Go to your GitHub **[Personal Access Tokens](https://github.com/settings/tokens)** settings
    >  2. Select **_Generate new token (classic)_**
    >  3. Give the token a name and select scope **_`read:packages`_**
    >  4. Copy the generated token and replace the string _**`YOUR_GITHUB_AUTH_TOKEN`**_ in the **_`.npmrc`_** file in the project base.
    >       Now, you should be able to install the [Dataverse JavaScript](https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript) client using npm.

```properties
# .npmrc

legacy-peer-deps=true
# js-dataverse registry
//npm.pkg.github.com/:_authToken=<YOUR_GITHUB_AUTH_TOKEN>
@iqss:registry=https://npm.pkg.github.com/
```

### Installation & Setup

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Install the project &amp; its dependencies

```sh
# root project directory
npm install
```

You may see a message about vulnerabilities after running this command.

Please check this announcement from Create React App repository [facebook/create-react-app#11174](https://github.com/facebook/create-react-app/issues/11174). These vulnerabilities will not be included in the production build since they come from libraries only used during development.

2. Build the UI Library, needed for running the application.

```sh
# root project directory
cd packages/design-system && npm run build
```

### Additional scrips available


**Running &amp; building the app:**

Run the app in the development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

```sh
# root project directory
npm start
```

The application will actively watch the directory for changes and reload when changes are saved. You may also see any existing linting errors in the console.


```sh
# Build the app for production to the `/dist/` directory:
npm run build
# Locally preview the production build:
npm run preview

```

**Storybook:**

Runs the Storybook in the development mode.

There are 2 Storybook instances, one for the general Design System and one for the Dataverse Frontend component specifications. Both should be started automatically and available at:
- Dataverse Frontend Storybook: [http://localhost:6006/](http://localhost:6006/)
- Dataverse Design System Storybook: [http://localhost:6007/](http://localhost:6007/)

```sh
# $ cd packages/design-system
npm run storybook

# 'npm run storybook` should automatically open in your default browser

# $ cd packages/design-system
npm run build-storybook

```


Note that both Storybook instances are also published to Chromatic as part of the build and merge processes, located at:

[![DataverseFrontend][DataverseFrontend-Chromatic]][DataverseFrontend-Chromatic-url]

<!-- https://www.chromatic.com/builds?appId=646f68aa9beb01b35c599acd -->

[![DataverseDesignSystem][DataverseDesignSystem-Chromatic]][DataverseDesignSystem-Chromatic-url]

<!-- https://www.chromatic.com/builds?appId=646fbe232a8d3b501a1943f3 -->

<!-- ```sh
npm run build-storybook
``` -->

**Testing with Cypress:**

Use the following commands to ensure your build passes checks for coding standards and coverage:

```sh
# root project directory
# Launches the Cypress test runner for the end-to-end [or unit] tests:
npm run test:e2e [test:unit]
# If you prefer to see the tests executing in Cypress you can run:
npm run cy:open-e2e [cy:open-unit]
# See current code coverage
npm run test:coverage

```


**Using `grep` with Cypress**

The project includes [@cypress/grep](https://www.npmjs.com/package/@cypress/grep) for running specific tests.

Some examples used by the grep library are below for reference:

```sh
# root project directory

# run only the tests with "auth user" in the title
$ npx cypress run --env grep="auth user"
# run tests with "hello" or "auth user" in their titles
# by separating them with ";" character
$ npx cypress run --env grep="hello; auth user"
```


To really target specific tests, add `--spec` argument

```sh
# root project directory

$ npx cypress run --env grep="loads the restricted files when the user is logged in as owner"
\ --spec tests/e2e-integration/e2e/sections/dataset/Dataset.spec.tsx
```


**Repeat and burn tests**
You can run the selected tests multiple times by using the `burn=N` parameter. For example, run all all the tests in the spec A five times using:

```sh
# root project directory
$ npx cypress run --env burn=5 --spec tests/e2e-integration/e2e/sections/dataset/Dataset.spec.tsx
```


**Formatting and Linting:**
Launch the linter. To attempt to automatically fix any errors found, use `npm run lint:fix`

```sh
# root project directory
npm run lint
# Find and fix linting errors automatically
npm run lint:fix
```


Launch the prettier formatter. We recommend you to configure your IDE to run prettier on save. See the official IDE setups used by the IQSS team at [vscode-settings](https://github.com/IQSS/vscode-settings) on GitHub.


```sh
# root project directory
npm run format
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- #### Additional Configurations -->

<!-- RUN LOCALLY -->

### Running the project Locally

A containerized environment, oriented to local development, is available to be run from the repository.

This environment contains a dockerized instance of the Dataverse backend with its dependent services (database, mailserver, etc), as well as an npm development server running the SPA frontend (With code watching).

This environment is intended for locally testing any functionality that requires access to the Dataverse API from the SPA frontend.

There is an Nginx reverse proxy container on top of the frontend and backend containers to avoid CORS issues while testing the application.

<!-- <details>
<summary>Tst</summary>

foo

```jsx
<Bar/>
```
Foo

</details> -->

**Run the environment**
As the script argument, add the name of the Dataverse image tag you want to deploy.

```sh
# /dev-env/ directory

# Installs and runs project off latest tagged container image
$ ./run-env.sh <DATAVERSE_IMAGE_TAG>

# Removes ...
$ ./rm-env.sh
```
Note that the image tag in the docker registry must to be pre pushed, otherwise the script will fail. You can find the existing tags on DockerHub [@gdcc/dataverse](https://hub.docker.com/r/gdcc/dataverse/tags)

If you are running the script for the first time, it may take a while, since npm has to install all project dependencies. This can also happen if you added new dependencies to `package.json`, or used the _uninstall_ script to remove current project files and shut down any running containers.

Once the script has finished, you will be able to access Dataverse via:

- Dataverse SPA Frontend: [http://localhost:8000/spa](http://localhost:8000/spa)
- Dataverse JSF Application: [http://localhost:8000](http://localhost:8000)

Note: The Dataverse configbaker takes some time to start the application, so the application will not be accessible until the bootstrapping is complete.

**Adding custom test data**
If you want to add test data (collections and datasets) to the Dataverse instance, run the following command:

```sh
# /dev-env/ directory
$ ./add-env-data.sh
```
Note: The above command uses the [dataverse-sample-data](https://github.com/IQSS/dataverse-sample-data) repository whose scripts occasionally fail, so some of the test data may not be added.

<!-- ### Running Tests

<details>
<summary>TODO</summary>

</details>
-->

### Deployment

Once the site is built through the **`npm run build`** command, it can be deployed in different ways to different types of infrastructure, depending on installation needs.

We are working to provide different preconfigured automated deployment options, seeking to support common use cases today for installing applications of this nature.

The current automated deployment options are available within the GitHub **`deploy`** workflow, which is designed to be run manually from GitHub Actions. The deployment option is selected via a dropdown menu, as well as the target environment.

#### Examples for AWS and Payara

<details>
<summary><strong>AWS S3 Deployment [Expand]</strong></summary>

This option will build and deploy the application to a remote S3 bucket.

For this workflow to work, a GitHub environment must be configured with the following environment secrets:

 - `AWS_ACCESS_KEY_ID`
 - `AWS_SECRET_ACCESS_KEY`
 - `AWS_S3_BUCKET_NAME`
 - `AWS_DEFAULT_REGION`

Note that for the deployment to the S3 bucket to succeed, you must make the following changes to the bucket via the S3 web interface (or equivalent changes using aws-cli or similar tools):

 - Under "_Permissions_", "_Permissions overview_", "_Block public access (bucket settings)_", click "_Edit_", then __uncheck__ "_Block all public access_" and save.
 - Under "Properties", "Static website hosting", click "Edit" and enable it. Change "Index document" and "Error document" to "index.html".
 - Under "Bucket policy", click "Edit" and paste the following policy (changing `<BUCKET_NAME>` to your bucket name) and save.

```json
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
You should see the deployed app at `http://[BUCKET-NAME].s3-website-[REGION].amazonaws.com`, for example; `http://my-dataverse-bucket.s3-website-us-east-1.amazonaws.com/`

</details>

<details>
<summary><strong>Payara Deployment [Expand]</strong></summary>

This option will build and deploy the application to a remote Payara server.

This option is intended for an "all-in-one" solution, where the Dataverse backend application and the frontend application run on the same Payara server.

For this workflow to work, a GitHub environment must be configured with the following environment secrets:

 - `PAYARA_INSTANCE_HOST`
 - `PAYARA_INSTANCE_USERNAME`
 - `PAYARA_INSTANCE_SSH_PRIVATE_KEY`

It is important that the remote instance is correctly pre-configured, with the Payara server running, and a service account for Dataverse with the corresponding SSH key pair established.

A base path for the frontend application can be established on the remote server by setting the corresponding field in the workflow inputs. This mechanism prevents conflicts between the frontend application and any pre-existing deployed application running on Payara, which can potentially be a Dataverse backend. This way, only the routes with the base path included will redirect to the frontend application.

</details>


<!-- USAGE EXAMPLES -->

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://guides.dataverse.org/en/latest/developers/index.html)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TODO: COMPONENTS -->

<!-- ## Components -->

<!-- TODO: CODE -->

<!-- ## Code -->

<!-- TODO: KNOWN ISSUES -->

<!-- ROADMAP -->

## Roadmap

- [ ] Add Changelog
- [ ] Add Additional Templates w/ Examples
- [ ] Add "Components" document to easily copy & paste sections of the readme
- [ ] More...


See the [open issues](https://github.com/IQSS/dataverse-frontend/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "`enhancement`".

We love PRs! Read the Contributor Guidelines for more info. Say hello, share your tips/work, and spread the love on ... <!--TODO-->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TODO: RELATED & OFFICIAL PROJECTS  -->

<!-- TODO: HELPFUL LINKS -->

<!-- LICENSE -->

## License

Distributed under the Apache License, Version 2.0. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Email us with software installation questions. Please note our response time is generally 24 business hours.

<!-- TODO: Social Links -->

### For developers and Dataverse Repositories

Report issues and contribute to our code: Report bugs and add feature requests in GitHub Issues or use GitHub pull requests, if you have some code, scripts or documentation that you'd like to share. If you have a security issue to report, please email <a href="mailto:security@dataverse.org">security@dataverse.org</a>.

Ask a question or start a discussion: A great place to publicly share feedback, ideas, feature requests, and troubleshoot any issues is in the dataverse-community mailing list. Additional mailing lists are available, including language-specific ones.

Chat with us at chat.dataverse.org.

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/IQSS/dataverse-frontend](https://github.com/IQSS/dataverse-frontend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

<!-- NodeJS -->
<!-- React -->
<!-- Typescript -->
<!-- Bootstrap -->
<!-- Cypress -->
<!-- ReactTestingLibrary -->
<!-- Storybook -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- NodeJS -->

[![Node][Node.js]][Node-url]

[Node.js]: https://img.shields.io/badge/node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/

<!-- React -->

[![React][React.js]][React-url]

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

<!-- Typescript -->

[![TypeScript][TypeScript]][Typescript-url]

[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://typescriptlang.org/

<!-- Bootstrap -->

[![Bootstrap][Bootstrap.com]][Bootstrap-url]

[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com

<!-- Cypress -->

[![Cypress][Cypress.io]][Cypress-url]

[Cypress.io]: https://img.shields.io/badge/Cypress-69D3A7?style=for-the-badge&logo=cypress&logoColor=black
[Cypress-url]: https://cypress.io/

<!-- ReactTestingLibrary -->

[![TestingLibrary][TestingLibrary]][TestingLibrary-url]

[TestingLibrary]: https://img.shields.io/badge/TestingLibrary-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white
[TestingLibrary-url]: https://svelte.dev/

<!-- Storybook -->

[![Storybook][Storybook.com]][Storybook-url]

[Storybook.com]: https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white
[Storybook-url]: https://laravel.com

<!-- Contributors -->

[![GH-Contributors][GH-Contributors-shield]][GH-Contributors-url]

[GH-Contributors-shield]: https://img.shields.io/github/contributors/IQSS/dataverse-frontend?branch=develop&style=for-the-badge
[GH-Contributors-url]: https://github.com/IQSS/dataverse-frontend/graphs/contributors

<!-- Code Coverage -->

[![Coveralls Coverage][Coveralls-badge]][Coveralls-url]

[Coveralls-badge]: https://img.shields.io/coverallsCoverage/github/IQSS/dataverse-frontend?branch=develop&style=for-the-badge&logo=coveralls
[Coveralls-url]: https://coveralls.io/github/IQSS/dataverse-frontend?branch=develop

<!-- Workflow Status -->

[![WorkflowStatus][Workflow-badge]][Workflow-url]

[Workflow-badge]: https://img.shields.io/github/actions/workflow/status/IQSS/dataverse-frontend/test.yml?branch=develop&style=for-the-badge
[Workflow-url]: https://github.com/IQSS/dataverse-frontend/actions

<!-- Forks -->

![GitHub forks](https://img.shields.io/github/forks/IQSS/dataverse-frontend?style=for-the-badge)

<!-- Tag -->

![GitHub Tag](https://img.shields.io/github/v/tag/iqss/dataverse-frontend?style=for-the-badge)

<!-- Status -->

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.][RepoStatus-badge]][RepoStatus-url]

[RepoStatus-badge]: https://img.shields.io/badge/repo_status-WIP-yellow?style=for-the-badge
[RepoStatus-url]: https://www.repostatus.org/#wip

[![TestsStatus][TestsStatus-badge]][TestsStatus-url]

[TestsStatus-badge]: https://github.com/IQSS/dataverse-frontend/actions/workflows/test.yml/badge.svg
[TestsStatus-url]: https://github.com/IQSS/dataverse-frontend/actions/workflows/test.yml


<!-- Stars/Stargazers -->

[![Stargazers][stars-badge]][stars-url]

[stars-badge]: https://img.shields.io/github/stars/iqss/dataverse-frontend?style=for-the-badge
[stars-url]: https://github.com/IQSS/dataverse-frontend/stargazers

<!-- Issues -->

[![Open issues][issue-badge]][issue-url]

[issue-badge]: https://img.shields.io/github/issues/IQSS/dataverse-frontend?style=for-the-badge
[issue-url]: https://github.com/IQSS/dataverse-frontend/issues

<!-- Docker Desktop -->

[DockerDesktop-badge]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[DockerDesktop-url]: https://www.docker.com/products/docker-desktop/


[AmazonS3-badge]: https://img.shields.io/badge/AmazonS3-569A31?style=for-the-badge&logo=amazons3&logoColor=white
[AmazonS3-url]: https://aws.amazon.com/

[Payara-url]: https://www.payara.fish/



[product-screenshot]: images/screenshot.png

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->


[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com

<!-- [![npm version][npm-badge]][npm-url]
[![npm downloads][downloads-badge]][npm-url]
[![npm bundle size][size-badge]][size-url]
[![Open issues][issues-badge]][issues-url]

[![semantic-release][semantic-badge]][semantic-url]

[![CI][lint-badge]][lint-url]
[![CI][tsc-badge]][tsc-url]
[![CI][build-badge]][build-url]
[![CI][test-badge]][test-url]
[![CI][test-e2e-badge]][test-e2e-url]



[![CI][deploy-storybook-badge]][deploy-storybook-url]
[![CI][npm-release-badge]][npm-release-url] -->

[npm-url]: https://www.npmjs.com/package/react-parallax-tilt
[npm-badge]: https://img.shields.io/npm/v/react-parallax-tilt.svg
[size-url]: https://bundlephobia.com/package/react-parallax-tilt
[size-badge]: https://badgen.net/bundlephobia/minzip/react-parallax-tilt
[downloads-badge]: https://img.shields.io/npm/dm/react-parallax-tilt.svg?color=blue
[lint-badge]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/lint.yml/badge.svg
[lint-url]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/lint.yml
[tsc-badge]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/tsc.yml/badge.svg
[tsc-url]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/tsc.yml
[build-badge]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/build.yml/badge.svg
[build-url]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/build.yml
[test-badge]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/test.yml/badge.svg
[test-url]: https://react-parallax-tilt-test-unit-report.netlify.app/
[test-e2e-badge]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/test-e2e.yml/badge.svg
[test-e2e-url]: https://react-parallax-tilt-test-e2e-report.netlify.app/
[deploy-storybook-badge]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/deploy-storybook.yml/badge.svg
[deploy-storybook-url]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/deploy-storybook.yml
[npm-release-badge]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/npm-release.yml/badge.svg
[npm-release-url]: https://github.com/mkosir/react-parallax-tilt/actions/workflows/npm-release.yml
[semantic-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release

<!-- https://github.com/IQSS/dataverse-frontend/forks -->
<!-- https://github.com/IQSS/dataverse-frontend/custom-properties -->
<!-- https://github.com/IQSS/dataverse-frontend/tags  -->
<!--  -->
<!-- https://www.npmjs.com/package/@iqss/dataverse-design-system -->

<!-- NOTES -->
<!-- TODO: https://keepachangelog.com/en/1.1.0/ -->
<!-- TODO: https://github.com/cfpb/open-source-project-template/blob/main/opensource-checklist.md -->
<!-- TODO: MAKEFILE -->
<!-- TODO: API Docs -->
<!-- TODO: https://github.com/monicahq/monica?tab=readme-ov-file#contribute -->
<!-- TODO: Class Reference Documentation | https://github.com/vhesener/Closures/blob/master/README.md#--class-reference-documentation -->
<!-- TODO: Documentation: https://github.com/timber/timber?tab=readme-ov-file#documentation-1 -->
<!-- https://github.com/timber/docs -->
<!-- TODO: Multiple installation avenues?  -->
<!-- TODO: Credits: https://github.com/cfpb/open-source-project-template -->
<!-- TODO: Links -->

<!-- TODO: Developer Guide | https://www.codenameone.com/developer-guide.html -->
