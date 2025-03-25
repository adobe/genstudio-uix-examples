# GenStudio for Performance Marketing UI Extensibility Examples

This repository contains working examples of the usage of UI Extensibility in GenStudio for Performance Marketing.

## Goal

Through examples, we aim to demonstrate the potential of UI Extensibility and foster creativity.

## Installation

Each folder contains a reference app working UI Extension integrated with GenStudio for Performance Marketing.

In addition to git clone and/or forking this repo, you can generate an app from the [@adobe/aio-cli](https://github.com/adobe/aio-cli)

## Examples

- We recommend starting with an example app and attaching your Adobe App Builder Project to it.
- If you plan to develop both dialogs (Prompt Drawer and Right Panel) in the same App Builder Project, you can use the [GenStudio MLR Claims App](./genstudio-mlr-claims-app/) as a starting point.

Here is the list of examples:

- [GenStudio MLR Claims App](./genstudio-mlr-claims-app/)
  - This is an example of a MLR Claims App that loads claims from a claims library and provides both dialogs:
    - A dialog that opens in Prompt Drawer to add claims to the Generation Context
    - A dialog that opens in the right panel of a GS Experience draft to validate claims in the experience
  - This example was used in the 2025 Adobe Summit Session: A Developer's Guide: Extending Adobe GenStudio for Performance Marketing
- [GenStudio Create Validation App](./genstudio-create-validation/)
  - This is an example of an App for validating claims in a GS Experience draft
  - It includes 1 dialog that opens in the right panel of a GS Experience draft to validate claims in the experience
- [GenStudio Create Context Add On](./genstudio-create-context-addon/)
  - This is an example of a Context Add On that adds a new context to the Generation Context
  - It includes 1 dialog that opens in Prompt Drawer to add claims to the Generation Context
- [GenStudio IO Runtime App](./genstudio-io-runtime-app/)
  - This is an example of an App for using the IO Runtime Action
  - It includes the same code in MLR Claims App but uses the IO Runtime API to fetch claims from an external source

## Usage

1. Clone the repository
2. Install dependencies
3. Connect to your App Builder Project using the AIO CLI: `aio app use <path-to-downloaded-project-details>`
4. Run the app: `aio app run`
5. Deploy the app: `aio app deploy`
6. Go to the GenStudio workspace and see the extension point

## Deployment

### Repository Workflow vs Individual App Workflows

This repository contains two types of GitHub workflow files:

1. **Individual App Workflows**:

   - Located within each example app directory
   - These are provided as templates that can be used by developers who fork/clone a single example for their own projects
   - They are **not actually used** for deployments in this repository
   - If you're building a single extension based on one of our examples, these workflows provide a good starting point for your CI/CD pipeline

2. **Repository-level Custom Workflows**:
   - Located in the `.github/workflows` directory at the repository root
   - These include our reusable template workflow (`aio-app-template.yml`) and app-specific workflows that use it
   - We use this custom approach because we need to deploy multiple apps to multiple environments simultaneously

### GitHub Environment Secrets Management

We provide a utility script in the `scripts` directory that helps manage GitHub environment secrets:

- `scripts/create-env.js` - A script to create and update GitHub environment secrets from Adobe I/O configuration files
- This is particularly useful for setting up CI/CD with individual app workflows
- The script can extract secrets from Adobe I/O console.json files and securely create them in GitHub environments
- For more information, see the [script documentation](./scripts/README.md)

If you're implementing individual workflows for your own extension, this script can help you securely manage deployment secrets without manually entering them in the GitHub UI.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](./LICENSE) for more information.
