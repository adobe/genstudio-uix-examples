# Create Github Environment

> This script is specifically designed to work with GitHub Actions in the adobe/genstudio-uix-examples repository

A Node.js script to create and manage GitHub Environment Secrets from Adobe I/O console configuration files.

## Overview

This script automates the process of creating GitHub Environment Secrets from an Adobe I/O configuration file. It extracts key-value pairs from the console.json file and creates corresponding secrets in a GitHub environment.

## Usage

### Basic Usage

Run the script with default settings:

```bash
export GITHUB_TOKEN=your_github_token
node scripts/create-gh-env --env "Env Name" --file "/path to console.json"
```

To get the console.json file: (or manually download from developer console)

```
aio login --force
aio console ws download --orgId xxx@AdobeOrg --projectId xxx --workspaceId xxx
```

To switch between workspace:

```
aio app use -w <Production|Stage>
```

# Stage AIO

When working with an AIO stage instance, ensure you add the environment variable `AIO_CLI_ENV=stage` to your GitHub environment configuration

### Command Line Arguments

The script supports the following command line arguments:

| Argument          | Description                   | Default                     |
| ----------------- | ----------------------------- | --------------------------- |
| `--env <name>`    | GitHub environment name       | "Test Environment"          |
| `--file <path>`   | Path to the secrets JSON file | "./console.json"            |
| `--token <token>` | GitHub token                  | `GITHUB_TOKEN` env variable |
| `--owner <owner>` | Repository owner              | "adobe"                     |
| `--repo <repo>`   | Repository name               | "genstudio-uix-examples"    |
| `--help`          | Show help message             | -                           |

## Secret Mapping

The script maps the following Adobe I/O console properties to GitHub secrets:

| GitHub Secret                          | Adobe I/O Console Property                                                              |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| AIO_PROJECT_ID                         | project.id                                                                              |
| AIO_PROJECT_NAME                       | project.name                                                                            |
| AIO_PROJECT_ORG_ID                     | project.org.id                                                                          |
| AIO_PROJECT_WORKSPACE_DETAILS_SERVICES | project.workspace.details.services                                                      |
| AIO_PROJECT_WORKSPACE_ID               | project.workspace.id                                                                    |
| AIO_PROJECT_WORKSPACE_NAME             | project.workspace.name                                                                  |
| AIO_RUNTIME_AUTH                       | project.workspace.details.runtime.namespaces[0].auth                                    |
| AIO_RUNTIME_NAMESPACE                  | project.workspace.details.runtime.namespaces[0].name                                    |
| CLIENTID                               | project.workspace.details.credentials[0].oauth_server_to_server.client_id               |
| CLIENTSECRET                           | project.workspace.details.credentials[0].oauth_server_to_server.client_secrets[0]       |
| IMSORGID                               | project.org.ims_org_id                                                                  |
| SCOPES                                 | project.workspace.details.credentials[0].oauth_server_to_server.scopes                  |
| TECHNICALACCOUNTEMAIL                  | project.workspace.details.credentials[0].oauth_server_to_server.technical_account_email |
| TECHNICALACCOUNTID                     | project.workspace.details.credentials[0].oauth_server_to_server.technical_account_id    |

## How It Works

1. The script reads and parses the Adobe I/O configuration file
2. It extracts secrets according to the mapping defined above
3. It creates or updates a GitHub environment
4. It retrieves the GitHub environment's public key
5. It encrypts each secret value using sodium for security
6. It creates or updates each secret in the GitHub environment
