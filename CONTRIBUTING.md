# Guidance on how to contribute

> All contributions to this project will be released under the Apache License, Version 2.0.
> By submitting a pull request or filing a bug, issue, or
> feature request, you are agreeing to comply with this waiver of copyright interest.
> Details can be found in our [LICENSE](LICENSE).

Hey there! We’re really happy you’ve found your way here. Dataverse&reg; is a community project that is developed by people from all over the world. We appreciate any help.

Before you start working on something we would suggest talking to us in the [TODO: discussion forum](#) or asking a question on [TODO: GoogleGroups/Zulip](#). You can also contact us via the chat widget on the [TODO: main Dataverse website](#).

Here are ways to get involved:

1. [Star](https://github.com/iqss/dataverse-frontend/stargazers) the project!
2. Answer questions that come in through [GitHub issues](https://github.com/iqss/dataverse-frontend/issues?state=open).
3. [Report a bug](https://github.com/iqss/dataverse-frontend/issues/new?assignees=&labels=&projects=&title=%5BBUG%5D+Your+title) that you find.
4. Share a project you’ve built with Dataverse. This helps transfer knowledge about best practices, etc. _Add it to the [TODO: Showcase list](https://github.com/iqss/dataverse-frontend/foo/wiki/Showcase)_.
5. Browse ["help wanted"](https://github.com/iqss/dataverse-frontend/labels/help%20wanted) and ["good first issue"](https://github.com/iqss/dataverse-frontend/labels/good%20first%20issue) labels for areas of Dataverse/JavaScript/code you know well to consider, build or document.
6. Answer questions on [Google Groups | posted under the «Dataverse» tag](#). You can also [TODO: subscribe to a tag](#) via email to get notified when someone needs help.
7. Answer questions and join in on [Google Groups/Zulip Discussions](#).

## Using the issue tracker

Use the issue tracker to suggest feature requests, report bugs, and ask questions.
This is also a great way to connect with the developers of the project as well
as others who are interested in this solution.

Use the issue tracker to find ways to contribute. Find a bug or a feature, mention in
the issue that you will take on that effort, then follow the _Changing the code-base_
guidance below.

## Documenting

This is probably one of the most important things you can do as a contributor and probably one of the easiest things you can do. There are two big pieces of documentation you can edit right here on github!

The first is the [TODO: Readme?](https://www.codenameone.com/javadoc/) which you can edit directly in the source code, if there is an ommission or a mistake you can just press the edit button on the file and make the change directly even without an IDE. These pull requests are highly appreciated and will help future generations of developers!

The [Dataverse developer guide](https://guides.dataverse.org/en/latest/developers/index.html) is generated from [TODO: the wiki pages of this project](https://github.com/iqss/dataverse-frontend/foo/wiki/). You can just [TODO: edit the wiki directly](#), and your changes will reflect in the developers guide. Don't forget to edit the authors section and add some credit!

Please try to maintain the convention for the guide as we automate many pieces in the guide generation and conversion.

## Changing the code-base

Generally speaking, you should fork this repository, make changes in your
own fork, and then submit a pull request. All new code should have associated
unit tests that validate implemented features and the presence or lack of defects.
Additionally, the code should follow any stylistic and architectural guidelines
prescribed by the project. In the absence of such guidelines, mimic the styles
and patterns in the existing code-base.

Pull requests are highly appreciated. More than [X people](https://github.com/iqss/dataverse/graphs/contributors) have written parts of Dataverse (so far). Here are some guidelines to help:

1. **Solve a problem** – Features are great, but even better is cleaning-up and fixing issues in the code that you discover.
2. **Write tests** – This helps preserve functionality as the codebase grows and demonstrates how your change affects the code.
3. **Write documentation** – Timber is only useful if its features are documented. This covers inline documentation of the code as well as documenting functionality and use cases in the Guides section of the documentation.
4. **Small > big** – Better to have a few small pull requests that address specific parts of the code, than one big pull request that jumps all over.
5. **Comply with Coding Standards** – See next section.

## Preparations

After you’ve forked the Dataverse Frontend repository, you should install all npm dependencies.

```bash
npm install
```

## Coding Standards

We use [TODO: EasyCodingStandard](https://github.com/symplify/easy-coding-standard) for Dataverse’s code and code examples in the documentation, which follows the [TODO: X: Extended Coding Styles](#).

We use ESLint to automatically check and apply the coding standards to our codebase, reducing the manual work to a minimum.

### Check and apply coding standards

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

We use [TODO: XX](#) to add pre-commit hooks which automatically check the committed code changes for any coding standard violations.

### Tests

`npm run test:unit` Launches the test runner for the unit tests in the interactive watch mode.
If you prefer to see the tests executing in cypress you can run `npm run cy:open-unit`
You can check the coverage with `npm run test:coverage`

`npm run test:e2e` Launches the Cypress test runner for the end-to-end tests.
If you prefer to see the tests executing in cypress you can run `npm run cy:open-e2e`

### Other commands

There are more commands that we use to ensure code quality. Usually, you won’t need them.

<!-- TODO: -->

## Process

All PRs receive a review from at least one maintainer. We’ll do our best to do that review as soon as possible, but we’d rather go slow and get it right than merge in code with issues that just lead to trouble.

### GitHub reviews & assignments

You might see us assign multiple reviewers, in this case these are OR checks (i.e. either Person1 or Person2) unless we explicitly say it’s an AND type thing (i.e. can both Person3 and Person4 check this out?).

We use the assignee to show who’s responsible at that moment. We’ll assign back to the submitter if we need additional info/code/response, or it might be assigned to a branch maintainer if it needs more thought/revision (perhaps it’s directly related to an issue that's actively being worked on).

Once approved, the lead maintainer for the branch should merge the PR into the `develop` branch.

### Codeowners

We use a [CODEOWNERS](https://github.com/iqss/dataverse-frontend/blob/master/.github/CODEOWNERS) file to define who gets automatic review invitations.

## Ownership

By contributing code you are granting _(`Dataverse`)_ shared ownership of your work. You still own it but _(`Dataverse`)_ will have the right to relicense your work based on our needs & treat this work as if it was developed by a _(`Dataverse`)_ engineer.

## Browser support
<!-- TODO: ? -->
<!-- We configure our build chain tools
(typically [Autoprefixer](https://github.com/postcss/autoprefixer)
and [Babel](https://babeljs.io))
to support a reasonable set of backward compatibility with older browsers. -->
