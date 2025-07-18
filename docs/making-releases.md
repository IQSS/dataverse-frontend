# Making Releases

- [Introduction](#introduction)
- [Regular or Hotfix?](#regular-or-hotfix)
- [Create Github Issue and Release Branch](#create-github-issue-and-release-branch)
- [Update the version](#update-the-version)
- [Use the Latest Dataverse Client Javascript Version](#use-the-latest-dataverse-client-javascript-version)
- [Merge "release branch" into "main"](#merge-release-branch-into-main)
- [Create a Draft Release on GitHub and Tag the Version](#create-a-draft-release-on-github-and-tag-the-version)
- [Merge "release branch" into "develop"](#merge-release-branch-into-develop)
- [Delete "release branch"](#delete-release-branch)

## Introduction

This document is about releasing a new version of the dataverse-frontend repository.

## Regular or Hotfix?

Early on, make sure it’s clear what type of release this is. The steps below describe making both regular releases. Suppose the current version is 1.0.0.

- Regular
  - e.g. 1.1.0 (minor)
  - e.g. 2.0.0 (major)
- Hotfix
  - e.g. 1.1.1 (patch)

## Create Github Issue and Release Branch

First of all create an issue on Github to prepare the release, name it "Release dataverse-frontend vX.X.X".

On your local, create the release branch from the latest from develop and name it release/X.X.X .

## Update the version

To update the version run the command `npm version <X.X.X> --no-git-tag-version`. So if we are releasing version `3.5.0` the command will be:

```shell
npm version 3.5.0 --no-git-tag-version
```

This command will update the version in the `package.json` and `package-lock.json`.

## Use the Latest Dataverse Client Javascript Version

During development, the `@iqss/dataverse-client-javascript` package is installed from the [GitHub Packages Registry](https://github.com/IQSS/dataverse-client-javascript/pkgs/npm/dataverse-client-javascript), where we publish versions from PRs and the develop branch. However, for production we are going to use the latest published version of `@iqss/dataverse-client-javascript` package [from npm](https://www.npmjs.com/package/@iqss/dataverse-client-javascript?activeTab=versions).

⚠️ Before next step please ensure that any lines registering the `@iqss` scope with the GitHub Packages registry are commented out in the `.npmrc` file. Otherwise, you will encounter an error when trying to install the package as it will attempt to fetch the package from the GitHub registry instead of npm.

You can do this by running the following command in the root of the repository:

```shell
npm install @iqss/dataverse-client-javascript@latest --save --save-exact
```

This command will update the `package.json` and `package-lock.json` files with the latest version of the `dataverse-client-javascript` package.

If everything looks good, you can push the changes to the repository.

## Merge "release branch" into "main"

Create a pull request to merge the `release` branch into the `main` branch.
Once important tests have passed (unit, functional, integration).

## Create a Draft Release on GitHub and Tag the Version

After merging the `release` branch into the `main` branch, you should create a release on GitHub and tag the version.

Go to https://github.com/IQSS/dataverse-frontend/releases/new to start creating a draft release.

- Under "Choose a tag" you will be creating a new tag. Have it start with a "v" such as v3.5.0. Click "Create new tag on publish".

- Under "Target", choose "main".

- Under "Release title" use the same name as the tag such as v3.5.0.

- Add a description of the changes included in this release. Summarize the key updates, fixes, or features.

- Click "Save draft" because we do not want to publish the release yet.

At this point you can send around the draft release for any final feedback. Make corrections to the draft, if necessary. Publish once everything is ok.

## Merge "release branch" into "develop"

After merging the release branch into `main`, ensure the develop branch is updated with the latest changes.

```shell
git checkout develop
git merge release/X.X.X
git push origin develop
```

## Delete "release branch"

Once the release process is complete and the `release` branch has been merged into both `main` and `develop`, you can safely delete the `release` branch to keep the repository clean.

- Delete the branch locally from your repository.
- Delete the branch remotely from the remote repository.

This ensures that the `release` branch is no longer present in either your local or remote repositories.
