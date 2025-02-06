# GenStudio for Performance Marketing UI Extensibility Examples

This repository contains working examples of the usage of UI Extensibility in GenStudio for Performance Marketing.

## Goal

Through examples, we aim to demonstrate the potential of UI Extensibility and foster creativity.

## Installation

Each folder contains a reference app working UI Extension integrated with GenStudio for Performance Marketing.

In addition to git clone and/or forking this repo, you can generate an app from the [@adobe/aio-cli](https://github.com/adobe/aio-cli)


## Examples

Here is the list of examples:
- [GenStudio Create Validation/Compliance Reference App](./genstudio-create-validation/)
- [GenStudio Create Additonal Context Reference App](./genstudio-create-context-addon/)


## Deployment
Each example has its own GitHub Actions deployment file that should be used as a starting point for individual extensions.

The root-level GitHub deployment file `deploy_prod.yml` is intended as a custom, all-in-one approach for deploying examples with stored secrets. Each example that needs to be deployed at a workspace must have an associated secret. For example, `genstudio-create-validation` must have a secret named `genstudio_create_validation_sample` (with hyphens replaced by underscores) and the contents of the `.env` file as its value. Deployment will be triggered on merging PRs and push events on the main branch. Deployment will be skipped if this secret is unavailable.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](./LICENSE) for more information.
