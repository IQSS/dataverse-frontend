<a name="readme-top"></a>

<br />
<div align="center">
  <h1 align="center">Developer Guide</h1>
  <p align="center">
    <strong>Guidelines and instructions for developers working on the Dataverse Frontend</strong>
  </p>
</div>

---

## Table of Contents

  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation-setup">Installation & Setup</a></li>
        <li><a href="#running-the-project-locally">Running the Project Locally</a></li>
      </ul>
    </li>
    <li><a href="#breakdown-of-architecture-design-methodology">Breakdown of Architecture Design Methodology</a>
        <ul>
            <li><a href="#the-spa-re-architecture-vision">The SPA Re-architecture Vision</a></li>
            <li><a href="#core-components-of-the-spa-architecture">Core Components of the SPA Architecture</a></li>
            <li><a href="#design-and-architecture-principles">Design and Architecture Principles</a></li>
            <li><a href="#domain-layer">Domain Layer</a></li>
            <li><a href="#infrastructure-layer">Infrastructure Layer</a></li>
            <li><a href="#data-flow-in-the-domain-and-infrastructure-layers">Data flow in the Domain and Infrastructure Layers</a></li>
            <li><a href="#presentation-layer">Presentation Layer</a></li>
            <li><a href="#technology-stack">Technology Stack</a></li>
            <li><a href="#future-directions">Future Directions</a></li>
        </ul>
    </li>
    <li>
        <a href="#coding-standards">Coding Standards</a>
        <ul>
            <li><a href="#general-principles">General Principles</a></li>
            <li><a href="#typescript">TypeScript</a></li>
            <li><a href="#javascript-standards">JavaScript Standards</a></li>
            <li><a href="#react-standards">React Standards</a></li>
            <li><a href="#csssass-standards">CSS/SASS Standards</a></li>
            <li><a href="#linting">Linting</a></li>
            <li><a href="#check-and-apply-formatting-standards">Check and apply formatting standards</a></li>
            <li><a href="#enforcing-coding-standards-using-pre-commit-hooks">Enforcing coding standards using pre-commit hooks</a></li>
            <li><a href="#running-tests">Running Tests</a></li>
        </ul>
    </li>
    <li>
        <a href="#writing-test-cases">Writing test cases</a>
        <ul>
            <li><a href="#1-unit-tests-or-component-tests">Unit Tests or Component tests</a></li>
            <li><a href="#2-integration-tests">Integration Tests</a></li>
            <li><a href="#3-end-to-end-e2e-tests">End-to-End (e2e) Tests</a></li>
            <li><a href="#patterns-and-conventions">Patterns and Conventions</a></li>
            <li><a href="#continuous-integration-ci">Continuous Integration (CI)</a></li>
            <li><a href="#test-coverage">Test Coverage</a></li>
        </ul>
    </li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#publishing-the-design-system">Publishing the Design System</a></li>
  </ol>

---

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

> **Note:** The .npmrc file is not identical to .npmrc.example, as the latter contains the registry to publish the design
> system, see [Publishing the Design System](#publishing-the-design-system) for more information. To run the project you only
> need the above configuration.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
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

<p align="right">(<a href="#readme-top">back to top</a>)</p>
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

Please note that the image tag must be pre-pushed to the Docker registry; otherwise, the script will fail. You can find
the existing tags for alpha and unstable versions on DockerHub at [@gdcc/dataverse][dv_app_docker_image_url]. Images
associated with pull requests (PRs) are available in the [GitHub Container Registry].

````bash

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
````

> Note: The above command uses the [dataverse-sample-data][dv_repo_dvsampledata_url] repository whose scripts occasionally
> fail, so some test data may not be added.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

## Breakdown of Architecture Design Methodology

The Dataverse SPA (Single Page Application) represents a significant leap forward in the Dataverse project's aim to
provide a more dynamic, efficient, and user-friendly interface for data management and sharing. This section of the
Developer Guide outlines the key components of the SPA's design architecture, focusing on its modular, domain-driven design, and
the technology stack underpinning it.

### The SPA Re-architecture Vision

The SPA architecture is centered around several key goals designed to address the re-architecture challenges:

- API Extension: Enhancing the Dataverse API to serve as the backbone of the platform, facilitating rich, programmatic
  interactions with data. The API changes are addressed in the main [Dataverse repository][dv_repo_url].
- Modern Frontend Technologies: Transitioning to React and a suite of modern JavaScript tooling, aligning with
  contemporary web development practices for better performance, scalability, and developer experience.
- Modular and Reusable Components: Creating a library of reusable components and a design system specific to
  Dataverse's needs, ensuring consistency across the platform and easing the development of new features.
- Community Engagement and Growth: Lowering the barrier to entry for new contributors and enabling the community to
  play a more active role in the platform's development.

For more information on the motivations behind the SPA re-architecture, see the document [Restructuring the UI as a Single Page Application]

### Core Components of the SPA Architecture

#### Dataverse API

The foundation of the SPA is the Dataverse API, significantly expanded to support a wide range of functionalities. The
API facilitates interactions with datasets, files, collections, users, and permissions, and is designed with future
expansion in mind to accommodate evolving data management needs. The code can be found in the [Dataverse repository][dv_repo_url].

#### js-dataverse Library

The js-dataverse library abstracts the Dataverse APIs functionalities, providing developers with higher-level JavaScript
interfaces to interact with the API. This library is crucial for SPA development, offering a simplified, efficient way to
build frontend functionalities that interact with Dataverse data. The code can be found in the [js-dataverse repository][dv_repo_dvclientjs_url].

<p align="center">
<img  src="https://github.com/IQSS/dataverse-frontend/assets/23359572/300fa76e-9dd9-425b-867d-d8272c4154f9" alt="js-dataverse architecture">
</p>

#### Dataverse Design System

A cornerstone of the SPA's UI consistency is the Dataverse Design System, a collection of reusable UI components that
adhere to Dataverse's visual and usability standards. This system allows for the rapid development of new features and
ensures a cohesive user experience across the platform. You can find the deployed version of the design system at
[Dataverse Design System Storybook][dv_app_localhost_designsystem_url].

<p align="center">
<img src="https://github.com/IQSS/dataverse-frontend/assets/23359572/ddf86c2a-5930-4519-948b-57fcd136b04d" alt="Design system architecture">
</p>

### Design and Architecture Principles

The SPA's design is guided by Domain-Driven Design (DDD) principles, focusing on the core concepts of the Dataverse
platform. This approach ensures a clean separation of concerns, with dependencies pointing inward to prevent leakage of
implementation details.

<p align="center">
<img src="https://github.com/IQSS/dataverse-frontend/assets/23359572/78f2c642-ceaa-4e52-92b9-2c5a06a12ffb" alt="Domain Driven Design">
</p>

#### Domain Layer

This layer consists of models, repositories, and use cases, representing the application's core functionalities. Models
and interfaces define the structure of entities like Datasets, Files, Collections, and Users, while repositories provide
abstract interfaces to external resources. Use cases encapsulate the application logic, employing abstract repositories
for their implementation.

```
dataset/
├── domain/
    ├── models/
    │   ├── Dataset.ts
    │   ├── DatasetFormFields.ts
    │   ├── DatasetPaginationInfo.ts
    │   ├── DatasetItemTypePreview.ts
    │   ├── DatasetValidationResponse.ts
    │   └── TotalDatasetsCount.ts
    └── repositories/
    │   └── DatasetRepository.ts
    └── useCases/
        ├── createDataset.ts
        ├── getDatasetByPersistentId.ts
        ├── getDatasetPrivateUrlToken.ts
        ├── getDatasets.ts
        ├── getTotalDatasetsCount.ts
        └── validateDataset.ts
```

#### Infrastructure Layer

The Infrastructure Layer connects to external data sources, implementing the repositories defined in the Domain Layer.
It includes mappers for translating external data into domain objects, facilitating a decoupled architecture that allows
for flexible data management strategies.

```
infrastructure/
├── mappers/
│   ├── JSDatasetMapper.ts
│   ├── JSDatasetPreviewMapper.ts
│   └── JSDatasetVersionMapper.ts
└── repositories/
    └── DatasetJSDataverseRepository.ts
```

#### Data flow in the Domain and Infrastructure Layers

The Domain and Infrastructure Layers work together to manage data flow in the SPA, ensuring that business logic is
separated from external data sources. This separation allows for easier testing, maintenance, and scalability of the
application. The following diagram illustrates the flow of data between these layers for dataset operations:

<p align="center">
<img src="https://github.com/IQSS/dataverse-frontend/assets/23359572/3fe6f588-555d-4e37-835b-5f338ae41581" alt="Datasets use cases flow of data">
</p>

Here's a breakdown of the architecture components as depicted in the diagram:

- **Dataset Use Case**: This is the high-level functional component that encapsulates the business logic related to
  datasets. It serves as an entry point for any dataset operations and communicates with a dataset repository to fulfill
  these operations.

- **<<Abstract>> DatasetRepository**: This is an abstract interface declaring the methods that must be implemented for
  dataset interactions. By defining an abstract layer, we decouple the use cases from the concrete implementation,
  allowing for greater flexibility and easier testing.

- **Dataset[JSDataverse]Repository**: This represents the concrete implementation of the `DatasetRepository`. It's where
  the actual logic for interacting with the data source lives. In this case, the data source is the Dataverse API, and the
  repository implementation uses the `js-dataverse` library to interact with it.

- **js-dataverse (npm package)**: It provides the functions necessary to communicate with the Dataverse API. It
  abstracts the HTTP requests into JavaScript functions that return the data in a format that's easy to manage within a JavaScript application.

- **Dataverse API**: The ultimate endpoint for data, the Dataverse API is a backend service that manages and serves the
  dataset information. The API provides endpoints for CRUD operations and more, which `js-dataverse` will call.

##### Flow of Data

1. The `Dataset Use Case` receives a request from the application layer (like a UI component or another service) to
   perform an operation related to datasets.

2. It then uses the `DatasetRepository` interface to interact with the datasets. This interface is implemented
   specifically for the Dataverse API by the `Dataset[JSDataverse]Repository`, which translates the abstract methods into
   concrete actions using `js-dataverse`.

3. `js-dataverse` makes the necessary API calls to the `Dataverse API`. If the API call is successful, the data flows
   back through the layers to the original caller, or an error is thrown if something goes wrong, like if a dataset is not found.

By adhering to this architecture, the application ensures that the use cases (business logic) are kept separate from the
external data sources, making the system more robust, easier to test, and flexible to changes in the data source layer.

#### Presentation Layer

The Presentation Layer in our application architecture is where the user interface (UI) logic resides. It's responsible
for rendering the user interface, handling user interactions, and managing the state of the UI components.

```
src/
└── sections/
    ├── collection/
    ├── create-dataset/
    ├── dataset/
    ├── file/
    └── layout/
```

Let's break down the components of the Presentation Layer using the Dataset section as an example:

<p align="center">
<img src="https://github.com/IQSS/dataverse-frontend/assets/23359572/4b167284-fd15-48f4-90ff-e0e07af79c61" alt="Model View Presenter Diagram">
</p>

##### View

The View is represented by the React component (`<Dataset/>`), which is responsible for rendering the UI. It is designed
to be as simple as possible, with the sole responsibility of presenting data to the user. It can be divided into smaller
components for better organization and reusability.

The View communicates user actions to the Presenter but does not directly handle any state or business logic.

##### Presenter

The Presenter acts as the intermediary between the View and the Domain. In our implementation, this is where the
`useDataset` and `useFiles` hooks come into play. These hooks act as Presenters that handle the interaction logic and
state management. They retrieve data from the use cases (Domain), handle any necessary transformations or logic, and
pass it to the View.

##### Custom Hooks as Presenters

In the React ecosystem, hooks provide a way to use state and other React features without writing a class. Our custom
hooks (`useDataset` and `useFiles`) embrace the Presenter’s responsibilities by managing the state and preparing the
data for the View:

- `useDataset` **Hook**: Manages the state and logic for get-dataset-related operations, interacting with the
  `getDataset()` use case and updating the View accordingly.

- `useFiles` **Hook**: Similar to `useDataset`, it manages the state and logic for get-files-related operations,
  interacting with the `getFiles()` use case.

Both hooks encapsulate the "Presenter" logic, translating user actions into Use Cases calls and preparing data to
be displayed by the View.

Calling the `getDataset()` and `getFiles()` use cases can be considered part of the Presenter as well. They directly
interact with the Domain to retrieve data, enforce business rules, and then pass that data back to the Presenter hooks,
which in turn update the View.

##### Data Flow in the Presentation Layer

1. **User Interactions**: User actions are captured by the View.
2. **Presenter Logic**: The Presenter (custom hooks) receives these actions and communicates with the Use Cases to retrieve
   or update the data.
3. **Data Processing**: The Use Cases interact with the Domain to perform the necessary operations.
4. **View Updates**: The View renders the UI based on the data provided by the Presenter.

### Technology Stack

Our project leverages a robust stack of modern development tools and frameworks to ensure high-quality application
architecture and user experience. Below is a breakdown of our primary technologies:

| Technology                                                            | Description                                                                                                                                                                                                                |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![ReactJS][_shield_reactjs]][_uses_reactjs_url]                      | A JavaScript library for building user interfaces, React provides a declarative, component-based approach to UI development, making it easier to build and maintain complex applications.                                  |
| [![TypeScript][_shield_typescript]][_uses_typescript_url]             | An extension of JavaScript adding static types. TypeScript enhances code quality and robustness with compile-time error checking.                                                                                          |
| [![SAAS][_shield_saas]][_uses_saas_url]                               | A CSS preprocessor that extends CSS with features like variables, nesting, and mixins, SASS allows developers to write more maintainable and reusable stylesheets.                                                         |
| [![Bootstrap][_shield_bootstrap]][_uses_bootstrap_url]                | A popular CSS framework that provides a set of responsive, mobile-first components and utilities, Bootstrap helps developers build consistent, visually appealing interfaces quickly.                                      |
| [![Cypress][_shield_cypress]][_uses_cypress_url]                      | An end-to-end testing framework for web applications, Cypress allows developers to write and run tests that simulate user interactions and ensure the application works as expected.                                       |
| [![TestingLibrary][_shield_testinglibrary]][_uses_testinglibrary_url] | A suite of testing utilities that help developers write tests that focus on user behavior, Testing Library ensures that tests are more robust, maintainable, and aligned with user expectations.                           |
| [![Storybook][_shield_storybook]][_uses_storybook_url]                | A tool for developing UI components in isolation, Storybook allows developers to build, test, and document components independently of the application, improving component reusability and consistency.                   |
| [![Docker][_shield_docker]][_uses_docker_url]                         | A containerization platform that allows developers to package applications and their dependencies into lightweight, portable containers, Docker simplifies the development, deployment, and scaling of applications.       |
| [![Chromatic][_shield_chromatic]][_uses_chromatic_url]                | A visual testing platform that helps developers catch UI bugs and regressions early in the development process, Chromatic integrates with Storybook to provide visual snapshots of components and track changes over time. |

### Future Directions

The design architecture of the Dataverse SPA is not static; it is envisioned to evolve as new technologies emerge and as
the community's needs grow. Future directions may include further API extensions, enhancements to the design system, and
the incorporation of artificial intelligence and machine learning tools to facilitate data discovery and analysis.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

## Coding Standards

This project adheres to the following coding standards to ensure consistency, readability, and maintainability of the codebase.

### General Principles

- Code should be self-documenting. Choose descriptive names for variables and functions.
- Comment your code when necessary. Comments should explain the 'why' and not the 'what'.
- Keep functions small and focused. A function should ideally do one thing.
- Follow the DRY (Don't Repeat Yourself) principle. Reuse code as much as possible. But don't over-engineer, sometimes
  it's better to duplicate code than to overcomplicate it.

### TypeScript

- Follow the [TypeScript Deep Dive Style Guide].
- Use `PascalCase` for class names, `camelCase` for variables and functions, `UPPERCASE` for constants.
- Always specify the type when declaring variables, parameters, and return types.

### JavaScript Standards

- Use ES6+ syntax whenever possible.
- Prefer const and let to var for variable declarations.
- Use arrow functions () => {} for anonymous functions.

### React Standards

- Component Design: Prefer functional components with hooks over class components.
- State Management: Use local state (useState, useReducer) where possible and consider context or Redux for global state.
- Event Handlers: Prefix handler names with handle, e.g., handleClick.
- JSX: Keep JSX clean and readable. Split into smaller components if necessary.

### CSS/SASS Standards

Modularization: Store stylesheets near their respective components and import them as modules.

### Linting

We use ESLint to automatically check and apply the coding standards to our codebase, reducing the manual work to a minimum

To run all checks, you can run the `lint` script.

```bash
npm run lint
```

You can also apply coding style fixes automatically.

```bash
npm run lint:fix
```

### Check and apply formatting standards

Launches the prettier formatter. We recommend you to configure your IDE to run prettier on save.

```bash
npm run format
```

### Enforcing coding standards using pre-commit hooks

We use [pre-commit] library to add pre-commit hooks which automatically check the committed
code changes for any coding standard violations.

### Running Tests

Use the following commands to ensure your build passes checks for coding standards and coverage:

`npm run test:unit` Launches the test runner for the unit tests in the interactive watch mode.
If you prefer to see the tests executing in cypress you can run `npm run cy:open-unit`
You can check the coverage with `npm run test:coverage`

`npm run test:e2e` Launches the Cypress test runner for the end-to-end tests.
If you prefer to see the tests executing in cypress you can run `npm run cy:open-e2e`

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
<summary><strong>Running specific tests</strong></summary>

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

## Writing test cases

Testing is a crucial part of the SPA development. Our React application employs three main types of tests: Unit tests,
Integration tests, and End-to-End (e2e) tests. In this section, we'll describe each type of test and how to implement them.

### 1. **Unit Tests or Component tests:**

Unit tests are designed to test individual React components in isolation. In our approach, we focus on testing components
from the user's perspective, following the principles of the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
This means:

- **Test What Users See:** Focus on the output of the components, such as text, interactions, and the DOM, rather than
  internal implementation details like classes or functions.
- **Exceptions to the Rule:** In complex scenarios or where performance is a critical factor, we might test implementation
  details to ensure a repository is correctly called, for example. However, these cases are exceptions, and the primary
  goal remains on user-centric testing.
- **Avoid Testing Implementation Details:** Avoid testing implementation details like internal state or methods, as these
  tests are more brittle and less valuable than user-centric tests.
- **Mocking:** We use mocks to isolate components from their dependencies, ensuring that tests are focused on the component
  itself and not on its dependencies.
- **Tools and Frameworks:** We use [Cypress Component testing](https://docs.cypress.io/guides/component-testing/overview)
  alongside React Testing Library to render components in isolation and test their behavior.

<details>
<summary><strong>Example of a Unit Test</strong></summary>

```javascript
//tests/component/sections/home/Home.spec.tsx

import { Home } from '../../../../src/sections/home/Home'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetItemTypePreviewMother } from '../../dataset/domain/models/DatasetItemTypePreviewMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 10
const datasets = DatasetItemTypePreviewMother.createMany(totalDatasetsCount)
describe('Home page', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(totalDatasetsCount)
  })

  it('renders Root title', () => {
    cy.customMount(<Home datasetRepository={datasetRepository} />)
    cy.findByRole('heading').should('contain.text', 'Root')
  })
})
```

</details>

### 2. **Integration Tests:**

Test the integration of the SPA with external systems, such as APIs, third-party
libraries (like js-dataverse), or databases. This ensures that the application communicates correctly with outside
resources and services.

- **External Integrations:** Test the integration of the SPA with external systems, such as APIs, third-party
  libraries (like [js-dataverse](https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript/97068340)), or databases.
- **Tools and Frameworks:** We use Cypress for integration tests, to test the repository's implementation.

<details>
<summary><strong>Example of an Integration Test</strong></summary>

```javascript
//tests/e2e-integration/integration/datasets/DatasetJSDataverseRepository.spec.ts

describe('Dataset JSDataverse Repository', () => {
  before(() => TestsUtils.setup())
  beforeEach(() => {
    TestsUtils.login()
  })
  it('gets the dataset by persistentId', async () => {
    const datasetResponse = await DatasetHelper.create()

    await datasetRepository.getByPersistentId(datasetResponse.persistentId).then((dataset) => {
      if (!dataset) {
        throw new Error('Dataset not found')
      }
      const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)

      expect(dataset.license).to.deep.equal(datasetExpected.license)
      expect(dataset.metadataBlocks).to.deep.equal(datasetExpected.metadataBlocks)
      expect(dataset.summaryFields).to.deep.equal(datasetExpected.summaryFields)
      expect(dataset.version).to.deep.equal(datasetExpected.version)
      expect(dataset.metadataBlocks[0].fields.publicationDate).not.to.exist
      expect(dataset.metadataBlocks[0].fields.citationDate).not.to.exist
      expect(dataset.permissions).to.deep.equal(datasetExpected.permissions)
      expect(dataset.locks).to.deep.equal(datasetExpected.locks)
      expect(dataset.downloadUrls).to.deep.equal(datasetExpected.downloadUrls)
      expect(dataset.fileDownloadSizes).to.deep.equal(datasetExpected.fileDownloadSizes)
    })
  })
})
```

</details>

<details>
<summary><strong>Wait for no locks</strong></summary>

Some integration tests require waiting for no locks to be present in the dataset. This is done using the `waitForNoLocks`
method from the `TestsUtils` class.

```javascript
it('waits for no locks', async () => {
  const datasetResponse = await DatasetHelper.create()

  await DatasetHelper.publish(datasetResponse.persistentId)
  await TestsUtils.waitForNoLocks(datasetResponse.persistentId)

  await datasetRepository.getByPersistentId(datasetResponse.persistentId).then((dataset) => {
    if (!dataset) {
      throw new Error('Dataset not found')
    }
    expect(dataset.locks).to.deep.equal([])
  })
})
```

</details>

### 3. **End-to-End (e2e) Tests:**

End-to-end tests simulate real user scenarios, covering the complete flow of the application:

- **User Workflows:** Focus on common user paths, like searching for a file, logging in, or creating a Dataset. Ensure
  these workflows work from start to finish.
- **Avoid Redundancy:** Do not replicate tests covered by unit tests. E2E tests should cover broader user experiences.
  It is important to note that e2e tests are slower and more brittle than unit tests, so we use them sparingly.
- **Tools and Frameworks:** We use Cypress for e2e tests, to test the application's behavior from the user's perspective.
  It allows us to simulate user interactions and test the application's behavior in a real-world scenario.

<details>
<summary><strong>Example of an E2E Test</strong></summary>

```javascript
//tests/e2e-integration/e2e/sections/create-dataset/CreateDatasetForm.spec.tsx

describe('Create Dataset', () => {
  before(() => {
    TestsUtils.setup()
  })
  beforeEach(() => {
    TestsUtils.login()
  })

  it('navigates to the new dataset after submitting a valid form', () => {
    cy.visit('/spa/datasets/root/create')

    cy.findByLabelText(/Title/i).type('Test Dataset Title')
    cy.findByLabelText(/Author Name/i).type('Test author name', { force: true })
    cy.findByLabelText(/Point of Contact E-mail/i).type('email@test.com')
    cy.findByLabelText(/Description Text/i).type('Test description text')
    cy.findByLabelText(/Arts and Humanities/i).check()

    cy.findByText(/Save Dataset/i).click()

    cy.findByRole('heading', { name: 'Test Dataset Title' }).should('exist')
    cy.findByText(DatasetLabelValue.DRAFT).should('exist')
    cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
  })
})
```

</details>

> **Note:** Some end-to-end (e2e) tests are failing in local development environments despite passing in GitHub Actions.
> This discrepancy appears to be due to variations in machine resources.
>
> We need to investigate and potentially optimize several aspects of our local setup. Check the issue
> [here](https://github.com/IQSS/dataverse-frontend/issues/371).

### Patterns and Conventions

#### **Folder Structure**

We have a `tests` folder in the root of the project, with subfolders for each type of test (component,
integration, e2e). The folders for integration and e2e are together in the `e2e-integration` folder. We follow the same
structure that we use for the application.

#### **Test Naming**

We use the same naming conventions as the application, with the suffix `.spec`.

#### **Test Data for unit tests**

We use [faker](https://www.npmjs.com/package/@faker-js/faker) to create test data for unit tests. This library allows us
to generate realistic and varied test data with minimal effort. We use it to create random strings, numbers, and other
values, ensuring that tests cover a wide range of cases without introducing unpredictable failures.

**[Object Mother Pattern](https://martinfowler.com/bliki/ObjectMother.html)**

We use the Object Mother pattern to create test data for unit tests. These classes are located in the `tests/component`
folder.

The primary goal of the Object Mother pattern is to simplify the creation and management of test objects. It serves as a
centralized place where test objects are defined, making the testing process more streamlined and less error-prone. In this
pattern, we create a class or a set of functions dedicated solely to constructing and configuring objects needed for tests.

Some benefits of this pattern are:

- **Consistency:** It ensures consistent object setup across different tests, improving test reliability.
- **Readability:** It makes tests more readable and understandable by hiding complex object creation details.
- **Flexibility:** It allows us to create test data with different values and configurations.
- **Reusability:** It allows for the reuse of object configurations, reducing code duplication and saving time
- **Maintainability:** It centralizes object creation, making tests easier to maintain and update when object structures change.
- **Simplicity:** It simplifies test setup, allowing testers to focus more on the test logic than on object configuration.
- **Controlled Randomness:** It allows creating realistic and varied test scenarios while maintaining control over the randomness.
  This ensures tests cover a wide range of cases without introducing unpredictable failures.

<details>
<summary><strong>Example of an Object Mother class</strong></summary>

```javascript
//tests/component/dataset/domain/models/DatasetMother.ts

export class DatasetMother {
  static create(props?: Partial<Dataset>): Dataset {
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.words(3),
      ...props
    }
  }
}
```

</details>

#### **Test Data for integration and e2e tests**

We use some helper classes to create test data for the integration and e2e tests. These classes are located in the
`tests/e2e-integration/shared` folder.

The test data is created using [axios](https://www.npmjs.com/package/axios), which allows us to make requests to the
Dataverse API and create test data for the integration and e2e tests.

<details>
<summary><strong>Example of a Helper class to create test data</strong></summary>

```javascript
//tests/e2e-integration/shared/datasets/DatasetHelper.ts
export class DatasetHelper extends DataverseApiHelper {
  static async create(): Promise<DatasetResponse> {
    return this.request < DatasetResponse > (`/dataverses/root/datasets`, 'POST', newDatasetData)
  }
}
```

</details>

#### **Test Organization**

We organize tests into suites, grouping them by feature or user workflow. This makes it easier to find and run tests.

#### **Test Isolation**

We aim to keep tests as isolated as possible, avoiding dependencies between tests and ensuring that each test can run
independently.

### Continuous Integration (CI)

We run tests on every pull request and merge to ensure that the application is always stable and functional. You can
find the CI workflow in the `.github/workflows/test.yml` file.

CI checks include:

- **Unit Tests:** We run all unit tests to ensure that the application's components work as expected.
- **Integration Tests:** We run integration tests to ensure that the application communicates correctly with external
  systems.
- **E2E Tests:** We run e2e tests to ensure that the application's behavior is correct from the user's perspective.
- **Accessibility Tests:** We run checks to ensure that the application is accessible and that it meets the highest standards
  for accessibility compliance.
- **Code Coverage:** We check the test coverage to ensure that the application is well-tested and that new code is
  covered by tests.

### Test coverage

We aim for high test coverage, especially in critical areas of the application, like user workflows or complex components.
However, we prioritize user-centric testing over coverage numbers.

- **Coverage Threshold:** We aim for a test coverage of 95% for the unit tests. This threshold is set in the `.nycrc.json` file.
- **Coverage Reports:** We use [nyc](https://www.npmjs.com/package/nyc) to generate coverage reports, which are available
  in the `coverage` folder after running the tests. These reports are also published to [Coveralls](https://coveralls.io/github/IQSS/dataverse-frontend?branch=develop)
  with every pull request and merge. The coverage badge is displayed at the top of the README.
- **Tests included in the coverage:** We include all unit tests in the coverage report.
- **Pre-commit hook:** We use [pre-commit](https://www.npmjs.com/package/pre-commit) to run the unit tests before every commit,
  ensuring that no code is committed without passing the tests. It also runs the coverage checks to ensure that the coverage
  threshold is met.

#### How to run the code coverage

To generate the code coverage, you first need to run the tests with the `test:unit` script. After running the tests, you
can check the coverage with the `test:coverage` script.

If you want to see the coverage report in the browser, you can open the `coverage/lcov-report/index.html` file in the browser.

```bash
# root project directory

# Run the unit tests and generate the coverage report

npm run test:unit

# Check the coverage

npm run test:coverage
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
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

## Publishing the Design System

The Design System is published to the npm Package Registry. To publish a new version, follow these steps:

1. **Update the version**

   Update the version running the lerna command:

   ```shell
   lerna version --no-push
   ```

   This command will ask you for the new version and will update the `package.json` files and create a new commit with the changes.

2. **Review the auto generated CHANGELOG.md**

   The lerna command will generate a new `CHANGELOG.md` file with the changes for the new version. Review the changes and make sure that the file is correct.

   If it looks good, you can push the changes to the repository.

   ```shell
   git push && git push --tags
   ```

   Optional:

   If you need to make any changes to the `CHANGELOG.md` file, you can do it manually.

   After manually updating the `CHANGELOG.md` file, you can commit the changes.

   ```shell
   git add .
   git commit --amend --no-edit
   git push --force && git push --tags --force
   ```

   This command will amend the lerna commit and push the changes to the repository.

3. **Review the new tag in GitHub**

   After pushing the changes, you can review the new tag in the [GitHub repository](https://github.com/IQSS/dataverse-frontend/tags).

   The tag should be created with the new version.

4. **Publish the package**

   After the version is updated, you can publish the package running the lerna command:

   ```shell
   lerna publish from-package
   ```

   This command will publish the package to the npm registry.

   Remember that you need a valid npm token to publish the packages.

   Get a new token from the npm website and update the `.npmrc` file with the new token.

   Open the `.npmrc` file and replace `YOUR_NPM_TOKEN ` with your actual npm token.

   ```plaintext
   legacy-peer-deps=true

    //npm.pkg.github.com/:_authToken=YOUR_NPM_TOKEN
    @iqss:registry=https://npm.pkg.github.com/
   ```

5. **Review the new version in the npm registry**

   After publishing the packages, you can review the new version in the [npm registry](https://www.npmjs.com/package/@iqss/dataverse-design-system?activeTab=versions).

   The new version should be available in the npm registry.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<br>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

<!-- Datavserse Associated Repositories -->
<!-- @iqss/dataverse-client-javascript -->

[dv_repo_dvclientjs_url]: https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript
[dv_repo_dvclientjs_npm_url]: https://www.npmjs.com/package/js-dataverse
[dv_repo_dvsampledata_url]: https://github.com/IQSS/dataverse-sample-data
[dv_repo_url]: https://github.com/IQSS/dataverse

<!-- Application Instances -->
<!-- [dv_app_] -->

[dv_app_localhost_build_url]: http://localhost:5173
[dv_app_localhost_storybook_url]: http://localhost:6006/
[dv_app_localhost_designsystem_url]: http://localhost:6007/
[dv_app_localhost_spa_url]: http://localhost:8000/spa
[dv_app_localhost_legacy_url]: http://localhost:8000/

<!-- @gdcc/dataverse -->

[dv_app_docker_image_url]: https://hub.docker.com/r/gdcc/dataverse/tags
[Github Container Registry]: https://github.com/orgs/gdcc/packages/container/package/dataverse

<!-- Documentation -->
<!-- [dv_docs_] -->

[dv_docs_github_userauthtoken_url]: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app
[dv_docs_github_token_url]: https://github.com/settings/tokens
[Restructuring the UI as a Single Page Application]: https://docs.google.com/document/d/19pbENuYyHErEmblbFGQ47_uJpTfqVKbn9O0QftVqeeU/edit#heading=h.9b7lzr4a7odc
[TypeScript Deep Dive Style Guide]: https://basarat.gitbook.io/typescript/styleguide

<!-- 3rd Party Resources/References -->
<!-- [_uses_] -->

[_uses_docker_url]: https://www.docker.com/products/docker-desktop/
[_uses_repo_cra_error_url]: https://github.com/facebook/create-react-app/issues/11174
[_uses_reactjs_url]: https://reactjs.org/
[_uses_typescript_url]: https://typescriptlang.org/
[_uses_bootstrap_url]: https://getbootstrap.com
[_uses_cypress_url]: https://cypress.io/
[_uses_testinglibrary_url]: https://testing-library.com/docs/react-testing-library/intro/
[_uses_storybook_url]: https://storybook.js.org/
[_uses_payara_url]: https://www.payara.fish/
[_uses_docker_url]: https://www.docker.com/products/docker-desktop/
[_uses_aws3_url]: https://aws.amazon.com/
[_uses_saas_url]: https://sass-lang.com/
[_uses_chromatic_url]: https://www.chromatic.com/

<!-- @cypress/grep -->

[_uses_lib_grep_url]: https://www.npmjs.com/package/@cypress/grep

<!-- [_uses_lib_grep_url]:  -->

<!-- Shield Images -->
<!-- [_shield_] -->

[_shield_docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[_shield_reactjs]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[_shield_typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[_shield_bootstrap]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[_shield_cypress]: https://img.shields.io/badge/Cypress-69D3A7?style=for-the-badge&logo=cypress&logoColor=black
[_shield_testinglibrary]: https://img.shields.io/badge/TestingLibrary-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white
[_shield_storybook]: https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white
[_shield_amazons3]: https://img.shields.io/badge/AmazonS3-569A31?style=for-the-badge&logo=amazons3&logoColor=white
[_shield_chromatic]: https://img.shields.io/badge/Chromatic-FC521F?style=for-the-badge&logo=chromatic&logoColor=white
[_shield_saas]: https://img.shields.io/badge/SASS-CC6699?style=for-the-badge&logo=sass&logoColor=white

<!--  -->
<!--  -->
