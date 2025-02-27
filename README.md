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
    - This example was used in the 2025 Adobe Summit Session: A Developer’s Guide: Extending Adobe GenStudio for Performance Marketing
- [GenStudio Create Validation App](./genstudio-create-validation/)
    - This is an example of an App for validating claims in a GS Experience draft
    - It includes 1 dialog that opens in the right panel of a GS Experience draft to validate claims in the experience
- [GenStudio Create Context Add On](./genstudio-create-context-addon/)
    - This is an example of a Context Add On that adds a new context to the Generation Context
    - It includes 1 dialog that opens in Prompt Drawer to add claims to the Generation Context

## Usage
1. Clone the repository
2. Install dependencies
3. Connect to your App Builder Project using the AIO CLI: `aio app use <path-to-downloaded-project-details>`
4. Run the app: `aio app run`
5. Deploy the app: `aio app deploy`
6. Go to the GenStudio workspace and see the extension point


## Deployment
Each example has its own GitHub Actions deployment file that should be used as a starting point for individual extensions.

The root-level GitHub deployment file `deploy_prod.yml` is intended as a custom, all-in-one approach for deploying examples with stored secrets. Each example that needs to be deployed at a workspace must have an associated secret. For example, `genstudio-create-validation` must have a secret named `genstudio_create_validation_sample` (with hyphens replaced by underscores) and the contents of the `.env` file as its value. Deployment will be triggered on merging PRs and push events on the main branch. Deployment will be skipped if this secret is unavailable.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](./LICENSE) for more information.
