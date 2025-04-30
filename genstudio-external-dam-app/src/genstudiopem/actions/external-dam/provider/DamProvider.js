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
 * @typedef {Object} Asset - Asset object from @adobe/genstudio-uix-sdk
 */

/**
 * Interface for Digital Asset Management providers
 * @interface
 */
class DamProvider {
  /**
   * Search for assets in the DAM
   * @param {Object} params - Search parameters
   * @param {string} [params.prefix] - Prefix to search for
   * @param {number} [params.limit] - Maximum number of results to return
   * @returns {Promise<{statusCode: number, body: {assets: Asset[]}}>}
   */
  async searchAssets(params) {
    throw new Error("Method not implemented");
  }

  /**
   * Get a presigned URL for an asset
   * @param {Object} params - URL parameters
   * @param {string} params.assetId - ID of the asset
   * @returns {Promise<{statusCode: number, body: {url: string}}>}
   */
  async getAssetUrl(params) {
    throw new Error("Method not implemented");
  }

  /**
   * Get metadata for an asset
   * @param {Object} params - Metadata parameters
   * @param {string} params.assetId - ID of the asset
   * @returns {Promise<{statusCode: number, body: {metadata: Object}}>}
   */
  async getAssetMetadata(params) {
    throw new Error("Method not implemented");
  }
}

module.exports = DamProvider;
