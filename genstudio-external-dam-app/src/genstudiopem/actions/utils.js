/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Custom error type thrown when validation of request inputs fails.
 * @extends Error
 */
class ValidationError extends Error {}

/**
 * Returns a list of keys missing from `obj` based on the `required` list.
 * A parameter is missing if its value is undefined or ''.
 * A value of 0 or null is not considered as missing.
 *
 * @param {object} obj - object to inspect for missing keys
 * @param {string[]} required - list of required key paths (supports dot-notation)
 * @returns {string[]} array of missing key paths
 * @private
 */
function getMissingKeys(obj, required) {
  return required.filter((r) => {
    const splits = r.split(".");
    const last = splits[splits.length - 1];
    const traverse = splits.slice(0, -1).reduce((tObj, split) => {
      tObj = tObj[split] || {};
      return tObj;
    }, obj);
    return traverse[last] === undefined || traverse[last] === ""; // missing default params are empty string
  });
}

/**
 * Returns err message if `params` does not contain required params and headers.
 *
 * @param {object} params - action input parameters (including __ow_headers)
 * @param {string[]} requiredHeaders - list of required header names
 * @param {string[]} requiredParams - list of required parameter paths
 * @returns {string|null} err message listing missing inputs, or null if all present
 */
function checkMissingRequestInputs(
  params,
  requiredParams = [],
  requiredHeaders = []
) {
  let errorMessage = null;

  // input headers are always lowercase
  requiredHeaders = requiredHeaders.map((h) => h.toLowerCase());

  const missingHeaders = getMissingKeys(
    params.__ow_headers || {},
    requiredHeaders
  );
  if (missingHeaders.length > 0) {
    errorMessage = `missing header(s) '${missingHeaders}'`;
  }

  const missingParams = getMissingKeys(params, requiredParams);
  if (missingParams.length > 0) {
    if (errorMessage) {
      errorMessage += " and ";
    } else {
      errorMessage = "";
    }
    errorMessage += `missing parameter(s) '${missingParams}'`;
  }

  return errorMessage;
}

/**
 * Returns and logs an err response obj (for returning from your action's main()).
 *
 * @param {number} statusCode - HTTP status code for the error
 * @param {string} message - human-readable error message
 * @param {object} logger - logger instance with an error(message) method
 * @returns {{ error: { statusCode: number, body: { error: string } } }}
 *
 * @example
 * // inside your action’s main():
 * const logger = Core.Logger('main', { level: 'info' });
 * return errorResponse(400, 'Unsupported action type', logger);
 */
function errorResponse(statusCode, message, logger) {
  logger.error(message);
  return { error: { statusCode, body: { error: message } } };
}

module.exports = {
  checkMissingRequestInputs,
  errorResponse,
  ValidationError,
};
