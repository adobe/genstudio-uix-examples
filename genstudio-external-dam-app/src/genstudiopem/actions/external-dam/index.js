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

const { Core } = require("@adobe/aio-sdk");
const { errorResponse } = require("../utils");
const S3DamProvider = require("./provider/s3/S3DamProvider");

// Main action handler
exports.main = async (params) => {
  const logger = Core.Logger("main", { level: params.LOG_LEVEL || "info" });
  const actionType = params.actionType || "search";

  try {
    // Initialize the DAM provider
    const damProvider = new S3DamProvider(params);

    // Execute the requested action
    switch (actionType) {
      case "search":
        return await damProvider.searchAssets(params);
      case "getUrl":
        return await damProvider.getAssetUrl(params);
      case "getMetadata":
        return await damProvider.getAssetMetadata(params);
      default:
        return errorResponse(
          400,
          `Unsupported action type: ${actionType}`,
          logger
        );
    }
  } catch (error) {
    logger.error(error);
    return errorResponse(
      500,
      "Internal server error: " + error.message,
      logger
    );
  }
};
