#!/usr/bin/env node

/**
 * GitHub Environment Secrets Manager
 *
 * This script creates or updates GitHub environment secrets from a configuration file.
 * It reads secret values from a JSON file and creates them in a GitHub environment.
 */

import { Octokit } from "@octokit/core";
import sodium from "libsodium-wrappers";
import fs from "fs";
import path from "path";
import process from "process";

// Default configuration
const DEFAULT_CONFIG = {
  owner: "adobe",
  repo: "genstudio-uix-examples",
  environment_name: "Test Environment",
  secret_file: "./console.json",
  github_token: process.env.GITHUB_TOKEN,
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--env" && i + 1 < args.length) {
      config.environment_name = args[++i];
    } else if (args[i] === "--file" && i + 1 < args.length) {
      config.secret_file = args[++i];
    } else if (args[i] === "--token" && i + 1 < args.length) {
      config.github_token = args[++i];
    } else if (args[i] === "--owner" && i + 1 < args.length) {
      config.owner = args[++i];
    } else if (args[i] === "--repo" && i + 1 < args.length) {
      config.repo = args[++i];
    } else if (args[i] === "--help") {
      printHelp();
      process.exit(0);
    }
  }

  // Resolve relative file path
  if (!path.isAbsolute(config.secret_file)) {
    config.secret_file = path.resolve(process.cwd(), config.secret_file);
  }

  return config;
}

// Print help information
function printHelp() {
  console.log(`
GitHub Environment Secrets Manager

Usage: node create-env.js [options]

Options:
  --env <name>       Name of the GitHub environment (default: "Test Environment")
  --file <path>      Path to the secrets JSON file (default: "./console.json")
  --token <token>    GitHub token (default: uses GITHUB_TOKEN env variable)
  --owner <owner>    Repository owner (default: "adobe")
  --repo <repo>      Repository name (default: "genstudio-uix-examples")
  --help             Show this help message
  `);
}

// Secret mapping functions to extract values from JSON
const secretMapping = {
  AIO_PROJECT_ID: (f) => f.project.id,
  AIO_PROJECT_NAME: (f) => f.project.name,
  AIO_PROJECT_ORG_ID: (f) => f.project.org.id,
  AIO_PROJECT_WORKSPACE_DETAILS_SERVICES: (f) =>
    JSON.stringify(f.project.workspace.details.services),
  AIO_PROJECT_WORKSPACE_ID: (f) => f.project.workspace.id,
  AIO_PROJECT_WORKSPACE_NAME: (f) => f.project.workspace.name,
  AIO_RUNTIME_AUTH: (f) =>
    f.project.workspace.details.runtime.namespaces[0].auth,
  AIO_RUNTIME_NAMESPACE: (f) =>
    f.project.workspace.details.runtime.namespaces[0].name,
  CLIENTID: (f) =>
    f.project.workspace.details.credentials[0].oauth_server_to_server.client_id,
  CLIENTSECRET: (f) =>
    f.project.workspace.details.credentials[0].oauth_server_to_server
      .client_secrets[0],
  IMSORGID: (f) => f.project.org.ims_org_id,
  SCOPES: (f) =>
    f.project.workspace.details.credentials[0].oauth_server_to_server.scopes.join(
      ","
    ),
  TECHNICALACCOUNTEMAIL: (f) =>
    f.project.workspace.details.credentials[0].oauth_server_to_server
      .technical_account_email,
  TECHNICALACCOUNTID: (f) =>
    f.project.workspace.details.credentials[0].oauth_server_to_server
      .technical_account_id,
};

/**
 * Load and validate secret file
 * @param {string} filePath - Path to the secret file
 * @returns {Object} - Parsed JSON object
 */
function loadSecretFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Secret file not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading secret file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Extract secrets from JSON using mappings
 * @param {Object} json - Parsed JSON object
 * @returns {Array} - Array of {key, value} pairs
 */
function extractSecrets(json) {
  const secretKeys = Object.keys(secretMapping);

  return secretKeys
    .map((key) => {
      try {
        const value = secretMapping[key](json);
        return { key, value };
      } catch (error) {
        console.warn(
          `Warning: Could not extract secret ${key}: ${error.message}`
        );
        return { key, value: null };
      }
    })
    .filter((item) => item.value !== null);
}

/**
 * Display secrets in a formatted table
 * @param {Array} secrets - Array of {key, value} pairs
 */
function displaySecrets(secrets) {
  console.log("\n=== Environment Secrets ===\n");

  const maxKeyLength = Math.max(...secrets.map(({ key }) => key.length));

  secrets.forEach(({ key, value }) => {
    const paddedKey = key.padEnd(maxKeyLength, " ");
    const displayValue =
      typeof value === "string" && value.length > 100
        ? value.substring(0, 97) + "..."
        : value;
    console.log(`${paddedKey}  |  ${displayValue}`);
  });

  console.log("\n===========================\n");
}

/**
 * Create or update a GitHub environment
 * @param {Object} octokit - Octokit instance
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
async function createEnvironment(octokit, { owner, repo, environment_name }) {
  console.log(
    `Creating/updating environment "${environment_name}" for ${owner}/${repo}...`
  );

  try {
    await octokit.request(
      "PUT /repos/{owner}/{repo}/environments/{environment_name}",
      {
        owner,
        repo,
        environment_name,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      }
    );

    console.log(
      `Environment "${environment_name}" created/updated successfully.`
    );
  } catch (error) {
    throw new Error(`Failed to create environment: ${error.message}`);
  }
}

/**
 * Get GitHub environment public key
 * @param {Object} octokit - Octokit instance
 * @param {Object} config - Configuration object
 * @returns {Promise<Object>} - Public key data
 */
async function getPublicKey(octokit, { owner, repo, environment_name }) {
  console.log("Retrieving public key for secret encryption...");

  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key",
      {
        owner,
        repo,
        environment_name,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      }
    );

    console.log("Public key retrieved successfully.");
    return {
      key: response.data.key,
      keyId: response.data.key_id,
    };
  } catch (error) {
    throw new Error(`Failed to get public key: ${error.message}`);
  }
}

/**
 * Encrypt a secret using libsodium with the GitHub public key
 * @param {string} secretValue - The secret value to encrypt
 * @param {string} publicKey - The GitHub-provided public key
 * @returns {Promise<string>} - The encrypted secret value as base64
 */
async function encryptSecret(secretValue, publicKey) {
  // Wait for sodium to initialize
  await sodium.ready;

  // Convert the secret and public key to Uint8Array
  const binKey = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
  const binSecret = sodium.from_string(secretValue);

  // Encrypt the secret using the public key
  const encryptedBin = sodium.crypto_box_seal(binSecret, binKey);

  // Convert the encrypted Uint8Array to base64
  return sodium.to_base64(encryptedBin, sodium.base64_variants.ORIGINAL);
}

/**
 * Create or update a secret in the GitHub environment
 * @param {Object} octokit - Octokit instance
 * @param {Object} params - Parameters for creating the secret
 * @returns {Promise<void>}
 */
async function createSecret(octokit, params) {
  const { owner, repo, environment_name, secretName, encryptedValue, keyId } =
    params;

  try {
    await octokit.request(
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}",
      {
        owner,
        repo,
        environment_name,
        secret_name: secretName,
        encrypted_value: encryptedValue,
        key_id: keyId,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      }
    );

    console.log(`Secret "${secretName}" set successfully.`);
  } catch (error) {
    throw new Error(
      `Failed to create secret "${secretName}": ${error.message}`
    );
  }
}

/**
 * Main function that orchestrates the entire process
 */
async function main() {
  try {
    // Parse command line arguments
    const config = parseArgs();

    // Check if GitHub token is provided
    if (!config.github_token) {
      console.error(
        "Error: GitHub token is required. Use --token or set GITHUB_TOKEN environment variable."
      );
      process.exit(1);
    }

    // Initialize Octokit with GitHub token
    const octokit = new Octokit({
      auth: config.github_token,
    });

    // Load secrets from file
    const secretJson = loadSecretFile(config.secret_file);

    // Extract secrets using mappings
    const secrets = extractSecrets(secretJson);

    // Display extracted secrets
    displaySecrets(secrets);

    // Create or update the GitHub environment
    await createEnvironment(octokit, config);

    // Get the public key for secret encryption
    const { key, keyId } = await getPublicKey(octokit, config);

    // Create all secrets
    console.log(
      `Creating/updating ${secrets.length} secrets in environment "${config.environment_name}"...`
    );

    let successCount = 0;

    // Create each secret
    for (const { key: secretName, value: secretValue } of secrets) {
      try {
        // Encrypt the secret value
        const encryptedValue = await encryptSecret(secretValue, key);

        // Create or update the secret
        await createSecret(octokit, {
          owner: config.owner,
          repo: config.repo,
          environment_name: config.environment_name,
          secretName,
          encryptedValue,
          keyId,
        });

        successCount++;
      } catch (error) {
        console.error(
          `Error creating secret "${secretName}": ${error.message}`
        );
      }
    }

    console.log(
      `\nCompleted: ${successCount} of ${secrets.length} secrets created/updated successfully.`
    );
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    process.exit(1);
  }
}

// Execute the main function
main();
