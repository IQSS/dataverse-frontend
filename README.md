[![CI][_shield_projectstatus]][dv_repo_projectstatus_url]
[![CI][_shield_contributors]][dv_repo_contributors_url]
[![CI][_shield_stargazers]][dv_repo_stargazers_url]
[![CI][_shield_coveralls]][dv_repo_coveralls_url]
[![CI][_shield_workflow]][dv_repo_workflow_url]
[![CI][_shield_issues]][dv_repo_issues_url]
[![CI][_shield_forks]][dv_repo_forks_url]

<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="#">
    <img src="https://github.com/IQSS/dataverse-frontend/assets/7512607/6c4d79e4-7be5-4102-88bd-dfa167dc79d3" alt="Logo" width="500">
  </a>
  <h2 align="center">Dataverse Frontend</h2>
  <p align="center">
    <em>A New Way To Create and View Datasets &amp; Collections!</em>
    <br />
    <a href="https://guides.dataverse.org/en/latest/user/index.html"><strong>Explore the Docs »</strong></a>
    <br />
    <br />
    <a href="https://www.dataverse.org">Website</a> |
    <a href="https://beta.dataverse.org/spa">View Demo (BETA)</a> |
    <a href="https://github.com/IQSS/dataverse-frontend/issues">Report Bug</a> |
    <a href="https://github.com/IQSS/dataverse-frontend/issues">Request Feature</a>
  </p>
<br>
<h3>Progress Demo Videos</h3>
<p align="center">
  <a href="https://groups.google.com/g/dataverse-community/c/cxZ3Bal_-uo/m/h3kh3iVNCwAJ">Dataset Overview Page </a><small>(Aug. '23)</small> |
  <a href="https://groups.google.com/g/dataverse-community/c/w_rEMddESYc/m/6F7QC1p-AgAJ">Dataset Files Table </a><small>(Dec. '23)</small>
</p>
<h3>Chat with us!</h3>
</div>

[![Zulip][_shield_zulip]][dv_community_zulip_url]
[![GoogleDevsGrp][_shield_googledevs]][dv_community_google_devs_url]
[![GoogleUsersGrp][_shield_googleusers]][dv_community_google_users_url]

---

### ⚠️ Important Information About the Dataverse Frontend ⚠️

> Dataverse Frontend is currently in beta and under active development. While it offers exciting new features, please note that it may not be stable for production use. We recommend sticking to the latest stable [Dataverse][dv_repo_legacyjsf_url] release for mission-critical applications. If you choose to use this repository in production, be prepared for potential bugs and breaking changes. Always check the official documentation and release notes for updates and proceed with caution.

To stay up-to-date with all the latest changes, join the [Google Group][dv_community_google_users_url]

---

## Table of Contents

  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#demo-videos">Demo Videos</a></li>
        <li><a href="#what-is-dataverse">What is Dataverse?</a></li>
        <li><a href="#what-is-dataverse-frontend">What Is Dataverse Frontend &amp; How Do They Differ?</a></li>
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
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>

---

## About the Project

### What is Dataverse?

The Dataverse Project is an open source web application to share, preserve, cite, explore, and analyze research data. It
facilitates making data available to others, and allows you to replicate others' work more easily. Researchers, journals,
data authors, publishers, data distributors, and affiliated institutions all receive academic credit and web visibility.
Read more on the [Dataverse Website][dv_docs_dataverse_url].

<a name="what-is-dataverse-frontend"></a>

### What is Dataverse Frontend _&amp; How is it different?_

The Dataverse Frontend repository is an initiative undertaken in 2023 to modernize the UI and design of the Dataverse
Project by creating a stand-alone interface to allow users and organizations to implement their own Dataverse installations
and utilize the JavaScript framework of their choice.

**The goals of Dataverse Frontend:**

- Modernize the application
- Separate the frontend and backend logic, transition away from Monolithic Architecture
- Reimagine the current Dataverse backend as a headless API-first instance.
- The Dataverse Frontend becomes a stand-alone SPA (Single Page Application)
- Modularize the UI to allow third-party extension of the base project
- Increase cadence of development, decrease time between release cycles to implement new features
- Introduce testing automation
- Give priority and transparency to coding and design to support Harvard University's commitment to ensuring the highest
  standards for Accessibility Compliance
- Empower the community to create, contribute, and improve.

**New Features:**

- Node Application using ReactJS for the project baseline
- Native localization support through the i18n library
- Accessibility compliant code built from the ground-up
- Improved modularity via Web Components
- Cypress testing automation
- Storybook for UI Component Library

---

### Beta Testing Environment

_Track our progress and compare it to the current Dataverse application!_

To make the SPA Frontend accessible and testable by people interested in the project, there is a remote beta testing
environment that includes the latest changes developed both for the frontend application and the Dataverse backend
application (develop branches).

This environment follows the "all-in-one" solution described above, where both applications coexist on a Payara server.

Environment updates are carried out automatically through GitHub actions, present both in this repository and in the
Dataverse backend repository, which deploy the develop branches when any change is pushed to them.

The environment is accessible through the following URLs:

- Dataverse Frontend SPA: [beta.dataverse.org/spa][dv_app_beta_spa_url]
- Dataverse JSF: [beta.dataverse.org][dv_app_beta_legacyjsf_url]

### How Existing Dataverse Installations May Be Affected

- The existing Dataverse API will be added to and extended from the present backend architecture while the existing UI
  and current Dataverse functionalities are preserved.
- The SPA will continue its life as a separate application, supported on its own maintenance schedule.
- When the SPA has matured enough for an official release, we will switch to the new version and the [old backend][dv_repo_legacyjsf_url]
  will be moved into maintenance mode with no new features being introduced and focusing only on critical bugfixes.

<details>
  <summary><strong>Changes from the original Dataverse JSF application</strong></summary>

> ### Changes From the Style Guide
>
> The design system and frontend in this repo are inspired by the Dataverse Project [Style Guide][dv_docs_styleguide_url],
> but the following changes have been made, especially for accessibility.
>
> #### Links
>
> We added an underline to links to make them accessible.
>
> #### File Labels
>
> Now we are using Bootstrap with a theme, so there is only one definition for the secondary color. Since Bootstrap applies
> the secondary color to the labels automatically, the color of the file label is now the global secondary color which is
> a lighter shade of grey than what it used to be.
>
> We changed the citation block to be white with a colored border, to make the text in the box more accessible.
>
> ### Changes in Functionality &amp; Behavior
>
> Our main goal is to replicate the behavior of the original JSF application in all its functionalities, although during
> development we have found opportunities to review certain behaviors and apply changes where we find appropriate.
>
> #### Dataset Files Tab Search
>
> The original Dataset JSF page uses Solr to search for files based on the available filters. Past dataset versions are
> not indexed in Solr, so the filter option is not available (hidden) for such versions. When a version is indexed, the
> search text is searched in Solr, and Solr grammar can be applied. When the version is not indexed, the search text is
> searched in the database.
>
> The new SPA does not use Solr as the API endpoint it uses performs all queries on the database. Filters and search
> options are available for all versions in the same way, homogenizing behavior, although losing the possibility of
> using the Solr grammar.
>
> The decision of this change is made on the assumption that Solr may not be required in the context of files tab
> search, whose search facets are reduced compared to other in-application searches. Therefore, if we find evidence that
> the assumption is incorrect, we will work on extending the search capabilities to support Solr.

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

_To get a local copy up and running follow these simple example steps._

### Prerequisites

[![DockerDesktop][_shield_docker]][_uses_docker_url]

1. **Node &amp; NPM**: `node >= v16` and `npm >= v8`. Recommended versions for this project are `node v19` and `npm v9`.
2. **Docker**: We use Docker Desktop, but the Docker CLI will also work.
3. **Create a Copy of .npmrc**: In the project directory root, duplicate `.npmrc.example`, saving the copy as `.npmrc`.

   > ```bash
   > # root project directory
   > cp .npmrc.example .npmrc
   > ```

4. **Create and Add Your Npm and GitHub Tokens**: In order to connect with the Dataverse API, developers will need to
   install [@iqss/dataverse-client-javascript][dv_repo_dvclientjs_npm_url] from the GitHub registry by following the steps
   outlined below. Read more about access tokens on [GitHub Docs][dv_docs_github_userauthtoken_url].

   > **Getting a GitHub Token**
   >
   > 1. Go to your GitHub [Personal Access Tokens][dv_docs_github_token_url] settings
   > 2. Select `Generate new token (classic)`
   > 3. Give the token a name and select scope `read:packages`
   > 4. Copy the generated token and replace the string `YOUR_GITHUB_AUTH_TOKEN` in the previously created `.npmrc` file.
   >    Now, you should be able to install the [Dataverse JavaScript][dv_repo_dvclientjs_url] client using npm.

Afterwards, your .npmrc file should resemble the following:

```properties
# .npmrc
legacy-peer-deps=true
# js-dataverse registry
//npm.pkg.github.com/:_authToken=<YOUR_GITHUB_AUTH_TOKEN>
@iqss:registry=https://npm.pkg.github.com/
```

<br>

### Installation & Setup

1. Install the project &amp; its dependencies

```bash
# root project directory
npm install
```

> [!WARNING]
> You may see a message about vulnerabilities after running this command.
>
> Please check this announcement from Create React App repository
> [facebook/create-react-app#11174][_uses_repo_cra_error_url]. These vulnerabilities will not be included in the
> production build since they come from libraries only used during development.

2. Build the UI Library, needed for running the application.

```bash
# root project directory
cd packages/design-system && npm run build
```

**Running &amp; Building the App:**

Run the app in the development mode. Open [http://localhost:5173][dv_app_localhost_build_url] to view it in your browser.

```bash
# root project directory
npm start
```

The application will actively watch the directory for changes and reload when changes are saved. You may also see any
existing linting errors in the console.

```bash
# root project directory

# Build the app for production to the `/dist/` directory:
npm run build

# Locally preview the production build:
npm run preview

```

<br>

**Storybook:**

Runs the Storybook in the development mode.

There are 2 Storybook instances, one for the general Design System and one for the Dataverse Frontend component
specifications. Both should be started automatically and available at:

- Dataverse Frontend Storybook: [http://localhost:6006/][dv_app_localhost_storybook_url]
- Dataverse Design System Storybook: [http://localhost:6007/][dv_app_localhost_designsystem_url]

```bash
# $ cd packages/design-system

# `npm run storybook` should automatically open in your default browser
npm run storybook

# $ cd packages/design-system
npm run build-storybook

```

Note that both Storybook instances are also published to Chromatic as part of the build and merge processes, located at:

- [DataverseFrontend-Chromatic](https://www.chromatic.com/builds?appId=646f68aa9beb01b35c599acd)
- [DataverseDesignSystem-Chromatic](https://www.chromatic.com/builds?appId=646fbe232a8d3b501a1943f3)

<br>

**Testing with Cypress:**

Use the following commands to ensure your build passes checks for coding standards and coverage:

```bash
# root project directory

# Launches the Cypress test runner for the end-to-end [or unit] tests:
npm run test:e2e [test:unit]

# If you prefer to see the tests executing in Cypress you can run:
npm run cy:open-e2e [cy:open-unit]

# See current code coverage
npm run test:coverage

```

<br>

<details>
<summary><strong>Using `grep` with Cypress</strong></summary>

> The project includes [@cypress/grep][_uses_lib_grep_url] for running specific tests.
>
> Some examples used by the grep library are below for reference:
>
> ```bash
> # root project directory
>
> # run only the tests with "auth user" in the title
> $ npx cypress run --env grep="auth user"
>
> # run tests with "hello" or "auth user" in their titles by separating them with ";" character
> $ npx cypress run --env grep="hello; auth user"
> ```
>
> To target specific tests, add `--spec` argument
>
> ```bash
> # root project directory
>
> $ npx cypress run --env grep="loads the restricted files when the user is logged in as owner"
> \ --spec tests/e2e-integration/e2e/sections/dataset/Dataset.spec.tsx
> ```
>
> **Repeat and burn tests**
> You can run the selected tests multiple times by using the `burn=N` parameter. For example, run all all the tests in
> the spec Five times using:
>
> ```bash
> # root project directory
>
> $ npx cypress run --env burn=5 --spec tests/e2e-integration/e2e/sections/dataset/Dataset.spec.tsx
> ```

</details>

<br>

**Formatting and Linting:**

Launch the linter.

To attempt to automatically fix any errors found, use `npm run lint:fix`

```bash
# root project directory

npm run lint

# Find and fix linting errors automatically
npm run lint:fix
```

Launch the prettier formatter.

We recommend you to configure your IDE to run prettier on save. See the official IDE setups used by the IQSS team at
[vscode-settings][dv_repo_vscode_url] on GitHub.

```bash
# root project directory

npm run format
```

<br>

### Running the Project Locally

A containerized environment, oriented to local development, is available to be run from the repository.

This environment contains a dockerized instance of the Dataverse backend with its dependent services (database,
mail server, etc.), as well as a npm development server running the SPA frontend (With code watching).

This environment is intended for locally testing any functionality that requires access to the Dataverse API from the
SPA frontend.

There is a Nginx reverse proxy container on top of the frontend and backend containers to avoid CORS issues while
testing the application.

<br>

**Run the Environment**

As the script argument, add the name of the Dataverse image tag you want to deploy.

```bash
# /dev-env/ directory

# Installs and runs project off latest tagged container image
$ ./run-env.sh <DATAVERSE_IMAGE_TAG>

# Removes the project and its dependencies
$ ./rm-env.sh
```

Note that the image tag in the docker registry must be pre pushed, otherwise the script will fail. You can find the
existing tags on DockerHub [@gdcc/dataverse][dv_app_docker_image_url]

If you are running the script for the first time, it may take a while, since npm has to install all project dependencies.
This can also happen if you added new dependencies to `package.json`, or used the _uninstall_ script to remove current
project files and shut down any running containers.

Once the script has finished, you will be able to access Dataverse via:

- Dataverse SPA Frontend: [http://localhost:8000/spa][dv_app_localhost_spa_url]
- Dataverse JSF Application: [http://localhost:8000][dv_app_localhost_legacy_url]

Note: The Dataverse configbaker takes some time to start the application, so the application will not be accessible until
the bootstrapping is complete.

<br>

**Adding Custom Test Data**

If you want to add test data (collections and datasets) to the Dataverse instance, run the following command:

```bash
# /dev-env/ directory

$ ./add-env-data.sh
```

Note: The above command uses the [dataverse-sample-data][dv_repo_dvsampledata_url] repository whose scripts occasionally
fail, so some test data may not be added.

<br>

## Deployment

Once the site is built through the `npm run build` command, it can be deployed in different ways to different types of
infrastructure, depending on the needs of the installation.

We are working to provide different preconfigured automated deployment options, seeking to support common use cases
today for installing applications of this nature.

The current automated deployment options are available within the GitHub `deploy` workflow, which is designed to be run
manually from GitHub Actions. The deployment option is selected via a dropdown menu, as well as the target environment.

<details>
<summary><strong>Examples for AWS and Payara</strong></summary>

#### Deployment with AWS3

This option will build and deploy the application to a remote S3 bucket.

For this workflow to work, a GitHub environment must be configured with the following environment secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET_NAME`
- `AWS_DEFAULT_REGION`

Note that for the deployment to the S3 bucket to succeed, you must make the following changes to the bucket via the S3
web interface (or equivalent changes using aws-cli or similar tools):

- Under _`Permissions`_ ⏵ _`Permissions Overview`_ ⏵ _`Block public access (bucket settings)`_ ⏵ click _`Edit`_, then
  **uncheck** _`Block all public access`_ and save.
- Under _`Properties`_ ⏵ _`Static website hosting`_ ⏵ click _`Edit`_ and enable it. Change _`Index document`_ and
  _`Error document`_ to `index.html`.
- Under _`Bucket Policy`_, click _`Edit`_ and paste the following policy (changing `<BUCKET_NAME>` to your bucket name)
  and save.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Principal": "*",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::<BUCKET_NAME>/*"]
    }
  ]
}
```

You should see the deployed app at `http://[BUCKET-NAME].s3-website-[REGION].amazonaws.com`, for example;
`http://my-dataverse-bucket.s3-website-us-east-1.amazonaws.com/`

#### Deployment with Payara

This option will build and deploy the application to a remote Payara server.

This option is intended for an "all-in-one" solution, where the Dataverse backend application and the frontend
application run on the same Payara server.

For this workflow to work, a GitHub environment must be configured with the following environment secrets:

- `PAYARA_INSTANCE_HOST`
- `PAYARA_INSTANCE_USERNAME`
- `PAYARA_INSTANCE_SSH_PRIVATE_KEY`

It is important that the remote instance is correctly pre-configured, with the Payara server running, and a service
account for Dataverse with the corresponding SSH key pair established.

A base path for the frontend application can be established on the remote server by setting the corresponding field in
the workflow inputs. This mechanism prevents conflicts between the frontend application and any pre-existing deployed
application running on Payara, which can potentially be a Dataverse backend. This way, only the routes with the base
path included will redirect to the frontend application.

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

## Roadmap

Interested in what's being developed currently? See the [open issues][dv_repo_issues_url] for a full list of proposed
features (and known issues), and what we are working on in the [currently planned sprint][dv_repo_sprint_url].

Keep an eye out on [The Institute for Quantitative Social Science (IQSS) Dataverse Roadmap][hvd_iqss_roadmap_url] at
Harvard University to get a look at upcoming initiatives for the project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

## Contributing

We love PRs! Read the [Contributor Guidelines](CONTRIBUTING) for more info. Any contributions you make are **greatly appreciated**.

Got Questions? Join the conversation on [Zulip][dv_community_zulip_url], or our Google Groups for
[Developers][dv_community_google_devs_url] and [Users][dv_community_google_users_url]. Or attend community meetings,
hosted by the Global Dataverse Community Consortium to collaborate with the interest groups for
[Frontend Development][dv_community_gdcc_ui_url] and [Containerization][dv_community_gdcc_containers_url],
learn and share with communities around the world!

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

## Acknowledgments

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic][_uses_chromatic_url] for providing the visual testing platform that helps us review UI changes
and catch visual regressions.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

---

### Built With

- [![ReactJS][_shield_reactjs]][_uses_reactjs_url]
- [![NodeJS][_shield_nodejs]][_uses_nodejs_url]
- [![TypeScript][_shield_typescript]][_uses_typescript_url]
- [![Bootstrap][_shield_bootstrap]][_uses_bootstrap_url]
- [![Cypress][_shield_cypress]][_uses_cypress_url]
- [![TestingLibrary][_shield_testinglibrary]][_uses_testinglibrary_url]
- [![Storybook][_shield_storybook]][_uses_storybook_url]
- [![AmazonS3][_shield_amazons3]][_uses_aws3_url]
- [![Docker][_shield_docker]][_uses_docker_url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

---

## License

Distributed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

<!-- Dataverse SPA -->
<!-- https://github.com/IQSS/dataverse-frontend/custom-properties -->
<!-- [dv_repo_] -->

[dv_repo_url]: https://github.com/IQSS/dataverse-frontend
[dv_repo_issues_url]: https://github.com/IQSS/dataverse-frontend/issues
[dv_repo_sprint_url]: https://github.com/orgs/IQSS/projects/34/views/23
[dv_repo_contributors_url]: https://github.com/IQSS/dataverse-frontend/graphs/contributors
[dv_repo_stargazers_url]: https://github.com/IQSS/dataverse-frontend/stargazers
[dv_repo_coveralls_url]: https://coveralls.io/github/IQSS/dataverse-frontend?branch=develop
[dv_repo_workflow_url]: https://github.com/IQSS/dataverse-frontend/actions
[dv_repo_forks_url]: https://github.com/IQSS/dataverse-frontend/forks
[dv_repo_tag_url]: https://github.com/IQSS/dataverse-frontend/tags
[dv_repo_projectstatus_url]: https://www.repostatus.org/#wip
[dv_repo_releases_url]: https://github.com/IQSS/dataverse-frontend/releases

<!-- Datavserse Associated Repositories -->
<!-- @iqss/dataverse-client-javascript -->

[dv_repo_dvclientjs_url]: https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript
[dv_repo_dvclientjs_npm_url]: https://www.npmjs.com/package/js-dataverse
[dv_repo_dvsampledata_url]: https://github.com/IQSS/dataverse-sample-data
[dv_repo_legacyjsf_url]: https://github.com/IQSS/dataverse/
[dv_repo_legacyjsf_releases_url]: https://github.com/IQSS/dataverse/releases
[dv_repo_legacyjsf_issues_url]: https://github.com/IQSS/dataverse/issues
[dv_repo_vscode_url]: https://github.com/IQSS/vscode-settings

<!-- Application Instances -->
<!-- [dv_app_] -->

[dv_app_beta_spa_url]: https://beta.dataverse.org/spa
[dv_app_beta_legacyjsf_url]: https://beta.dataverse.org
[dv_app_legacyjsf_demo_url]: https://demo.dataverse.org/
[dv_app_localhost_build_url]: http://localhost:5173
[dv_app_localhost_storybook_url]: http://localhost:6006/
[dv_app_localhost_designsystem_url]: http://localhost:6007/
[dv_app_localhost_spa_url]: http://localhost:8000/spa
[dv_app_localhost_legacy_url]: http://localhost:8000/

<!-- @gdcc/dataverse -->

[dv_app_docker_image_url]: https://hub.docker.com/r/gdcc/dataverse/tags

<!-- Community and Affiliate sites -->
<!-- [dv_community_] -->

[dv_community_gdcc_url]: https://www.gdcc.io/
[dv_community_gdcc_ui_url]: https://ui.gdcc.io/
[dv_community_gdcc_containers_url]: https://ct.gdcc.io/
[dv_community_google_devs_url]: https://groups.google.com/g/dataverse-dev
[dv_community_google_users_url]: https://groups.google.com/g/dataverse-community
[dv_community_zulip_url]: https://dataverse.zulipchat.com/#narrow/stream/410361-ui-dev

<!-- Dataverse @ Harvard University & IQSS -->
<!-- [hvd_] -->

[hvd_iqss_url]: https://www.iq.harvard.edu/
[hvd_iqss_roadmap_url]: https://www.iq.harvard.edu/roadmap-dataverse-project
[hvd_legacyjsf_url]: https://dataverse.harvard.edu/

<!-- Documentation -->
<!-- [dv_docs_] -->

[dv_docs_dataverse_url]: https://dataverse.org/
[dv_docs_about_url]: https://dataverse.org/about
[dv_docs_styleguide_url]: https://guides.dataverse.org/en/latest/style/index.html
[dv_docs_api_url]: http://guides.dataverse.org/en/latest/api/index.html
[dv_docs_devs_url]: https://guides.dataverse.org/en/latest/developers/index.html
[dv_docs_github_userauthtoken_url]: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app
[dv_docs_github_token_url]: https://github.com/settings/tokens

<!-- 3rd Party Resources/References -->
<!-- [_uses_] -->

[_uses_reactjs_url]: https://reactjs.org/
[_uses_nodejs_url]: https://nodejs.org/
[_uses_typescript_url]: https://typescriptlang.org/
[_uses_bootstrap_url]: https://getbootstrap.com
[_uses_cypress_url]: https://cypress.io/
[_uses_testinglibrary_url]: https://testing-library.com/docs/react-testing-library/intro/
[_uses_storybook_url]: https://storybook.js.org/
[_uses_payara_url]: https://www.payara.fish/
[_uses_docker_url]: https://www.docker.com/products/docker-desktop/
[_uses_aws3_url]: https://aws.amazon.com/
[_uses_chromatic_url]: https://www.chromatic.com/
[_uses_repo_cra_error_url]: https://github.com/facebook/create-react-app/issues/11174
[_uses_tool_chromatic_url]: https://www.chromatic.com/builds?appId=646f68aa9beb01b35c599acd

<!-- @cypress/grep -->

[_uses_lib_grep_url]: https://www.npmjs.com/package/@cypress/grep

<!-- [_uses_lib_grep_url]:  -->

<!-- Shield Images -->
<!-- [_shield_] -->

[_shield_reactjs]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[_shield_nodejs]: https://img.shields.io/badge/node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=white
[_shield_typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[_shield_bootstrap]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[_shield_cypress]: https://img.shields.io/badge/Cypress-69D3A7?style=for-the-badge&logo=cypress&logoColor=black
[_shield_testinglibrary]: https://img.shields.io/badge/TestingLibrary-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white
[_shield_storybook]: https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white
[_shield_docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[_shield_amazons3]: https://img.shields.io/badge/AmazonS3-569A31?style=for-the-badge&logo=amazons3&logoColor=white
[_shield_zulip]: https://img.shields.io/badge/zulip-chat?style=for-the-badge&logo=zulip&logoColor=%236492FE
[_shield_googledevs]: https://img.shields.io/badge/Developer_Group-white?style=for-the-badge&logo=google
[_shield_googleusers]: https://img.shields.io/badge/User_Group-white?style=for-the-badge&logo=google

<!--  -->

[_shield_projectstatus]: https://img.shields.io/badge/repo_status-WIP-yellow?style=for-the-badge
[_shield_contributors]: https://img.shields.io/github/contributors/IQSS/dataverse-frontend?branch=develop&style=for-the-badge
[_shield_stargazers]: https://img.shields.io/github/stars/iqss/dataverse-frontend?style=for-the-badge
[_shield_coveralls]: https://img.shields.io/coverallsCoverage/github/IQSS/dataverse-frontend?branch=develop&style=for-the-badge

<!-- [_shield_releases]: -->

[_shield_workflow]: https://img.shields.io/github/actions/workflow/status/IQSS/dataverse-frontend/test.yml?branch=develop&style=for-the-badge
[_shield_issues]: https://img.shields.io/github/issues/IQSS/dataverse-frontend?style=for-the-badge
[_shield_forks]: https://img.shields.io/github/forks/IQSS/dataverse-frontend?style=for-the-badge
[_shield_tag]: https://img.shields.io/github/v/tag/iqss/dataverse-frontend?style=for-the-badge

<!-- Images -->
<!-- [_img_] -->

[_img_dv_logo_withbackground]: https://github.com/IQSS/dataverse-frontend/assets/7512607/6986476f-39ba-46a4-9be0-f05cd8e92244
[_img_dv_logo_nobackground]: https://github.com/IQSS/dataverse-frontend/assets/7512607/6c4d79e4-7be5-4102-88bd-dfa167dc79d3
[_img_screenshot]: images/screenshot.png

<!-- Video Links -->
<!-- August, 2023 -->

[_video_demo_datasetpage_url]: https://groups.google.com/g/dataverse-community/c/cxZ3Bal_-uo/m/h3kh3iVNCwAJ

<!-- December, 2023 -->

[_video_demo_filetable_url]: https://groups.google.com/g/dataverse-community/c/w_rEMddESYc/m/6F7QC1p-AgAJ

<!-- Social -->
<!-- [_social_] -->

[_social_twitter]: https://twitter.com/your_username

<!--  -->
<!--  -->
