## Publishing the Design System

The Design System is published to the npm Package Registry. To publish a new version, follow these steps:

1. **Update the Changelog**

   Move entries from Non Published Changes to the new version section and clear the Non Published Changes section.

2. **Update Readme with the latest Storybook build**

   Update the `README.md` file in the `packages/design-system` folder with the latest Storybook build.

   You can search this link in the Chromatic Deployment Github Action -> Publish To Chromatic step -> "View your Storybook at"

3. **Update the version**

   Commit all your changes so far.

   Update the version running the lerna command:

   ```shell
   lerna version --no-push
   ```

   This command will ask you for the new version and will update the `package.json` files and create a new commit with the changes.

   If it looks good, you can push the changes to the repository.

   ```shell
   git push && git push --tags
   ```

4. **Review the new tag in GitHub**

   After pushing the changes, you can review the new tag in the [GitHub repository](https://github.com/IQSS/dataverse-frontend/tags).

   The tag should be created with the new version.

5. **Build the package**

   Ensure the design system is built so the dist artifacts are available:

   ```bash
   # from the repo root
   npm run --workspace @iqss/dataverse-design-system build
   # or, from the package folder
   # cd packages/design-system && npm run build
   ```

   Note: publishing will also trigger a build automatically via the package's prepublishOnly script, but running it explicitly helps catch issues earlier.

6. **Publish the package**

   After the version is updated, you can publish the package running the lerna command:

   ```shell
   lerna publish from-package
   ```

   This command will publish the package to the npm registry.

   Remember that you need a valid npm token to publish the packages.

   Get a new token from the npm website and update the `.npmrc` file with the new token.

   Open the `.npmrc` file and replace `YOUR_NPM_TOKEN ` with your actual npm token.

   ⚠️ Please ensure that any lines registering the `@iqss` scope with the GitHub Packages registry are commented out. This is important because otherwise, the package would be published there instead of npm.

   ```plaintext
   legacy-peer-deps=true

    //npm.pkg.github.com/:_authToken=YOUR_NPM_TOKEN
    @iqss:registry=https://npm.pkg.github.com/
   ```

7. **Review the new version in the npm registry**

   After publishing the packages, you can review the new version in the [npm registry](https://www.npmjs.com/package/@iqss/dataverse-design-system?activeTab=versions).

   The new version should be available in the npm registry.
