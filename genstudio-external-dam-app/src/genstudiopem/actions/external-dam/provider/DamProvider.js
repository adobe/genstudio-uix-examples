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

const { checkMissingRequestInputs, ValidationError } = require("../../utils");

/**
 * @typedef {Object} Asset - Asset object from @adobe/genstudio-uix-sdk
 */

/**
 * @class DamProvider
 * @description
 *   Base class for Digital Asset Management providers.
 *   Uses the Template Method design pattern:
 *   - Public methods handle validation, then delegate to `do` methods.
 *   - Subclasses must override the `do` methods.
 */
class DamProvider {
  constructor(params, logger) {
    this.logger = logger;
  }

  /**
   * Validate common parameters for asset operations.
   * @param {Object} params
   * @returns {string|null} error message if validation fails, otherwise null
   */
  validateAssetParams(params) {
    const requiredParams = ["assetId"];
    const requiredHeaders = ["Authorization"];
    return checkMissingRequestInputs(params, requiredParams, requiredHeaders);
  }

  /**
   * Template Method for searching assets in the DAM.
   * 1. Validates params via `validateAssetParams`
   * 2. On validation error, throws `ValidationError`
   * 3. Otherwise calls subclass's `doSearchAssets`
   *
   * @param {Object} params
   * @param {string} [params.prefix] prefix to search for
   * @param {number} [params.limit] max number of results
   * @returns {Promise<{statusCode: number, body: {assets: Asset[]}}>}
   * @throws {ValidationError}
   */
  // eslint-disable-next-line no-unused-vars
  async searchAssets(_params) {
    throw new Error("searchAssets() not implemented");
  }

  /**
   * Template Method for retrieving a presigned URL.
   * 1. Validates params via `validateAssetParams`
   * 2. On validation error, throws `ValidationError`
   * 3. Otherwise calls subclass's `doGetAssetUrl`
   *
   * @param {Object} params
   * @param {string} params.assetId
   * @returns {Promise<{statusCode:number, body:{url:string}}>}
   * @throws {ValidationError}
   */
  async getAssetUrl(params) {
    const err = this.validateAssetParams(params);
    if (err) throw new ValidationError(err);
    return this.doGetAssetUrl(params);
  }

  /**
   * Template Method for fetching asset metadata.
   * 1. Validates params via `validateAssetParams`
   * 2. On validation error, throws `ValidationError`
   * 3. Otherwise calls subclass's `doGetAssetMetadata`
   *
   * @param {Object} params
   * @param {string} params.assetId
   * @returns {Promise<{statusCode:number, body:{metadata:Object}}>}
   * @throws {ValidationError}
   */
  async getAssetMetadata(params) {
    const err = this.validateAssetParams(params);
    if (err) throw new ValidationError(err);
    return this.doGetAssetMetadata(params);
  }

  /**
   * @abstract
   * @protected
   * @param {Object} params
   * @returns {Promise<{statusCode:number, body:any}>}
   */
  // eslint-disable-next-line no-unused-vars
  async doGetAssetUrl(_params) {
    throw new Error("doGetAssetUrl() not implemented");
  }

  /**
   * @abstract
   * @protected
   * @param {Object} params
   * @returns {Promise<{statusCode:number, body:any}>}
   */
  // eslint-disable-next-line no-unused-vars
  async doGetAssetMetadata(_params) {
    throw new Error("doGetAssetMetadata() not implemented");
  }
}

module.exports = DamProvider;
