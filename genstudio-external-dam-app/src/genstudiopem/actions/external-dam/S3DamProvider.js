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
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const DamProvider = require("./DamProvider");
const { errorResponse } = require("../utils");

class S3DamProvider extends DamProvider {
  constructor(params) {
    super();
    this.logger = Core.Logger("S3DamProvider", {
      level: params.LOG_LEVEL || "info",
    });
    // env variables are for local testing, aio runtime uses params
    this.client = new S3Client({
      credentials: {
        accessKeyId: params.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:
          params.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: params.AWS_REGION || process.env.AWS_REGION,
    });
    this.bucketName = params.S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;
  }

  async getS3PresignedUrl(key) {
    const getObjCmd = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await getSignedUrl(this.client, getObjCmd, { expiresIn: 3600 });
  }

  async searchAssets(params) {
    try {
      this.logger.info("Searching assets in S3");

      const listObjectsCmd = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: params.prefix || "",
        MaxKeys: parseInt(params.limit) || 100,
      });

      const listResult = await this.client.send(listObjectsCmd);
      this.logger.info(
        `Found ${listResult?.Contents?.length || 0} assets in S3`
      );

      const assets = await Promise.all(
        listResult?.Contents.map(async (item) => {
          const headCmd = new HeadObjectCommand({
            Bucket: this.bucketName,
            Key: item.Key,
          });
          const metadata = await this.client.send(headCmd);
          const originalUrl = await this.getS3PresignedUrl(item.Key);

          return {
            id: item.Key,
            name: item.Key.split("/").pop(),
            fileType: item.Key.split(".").pop().toUpperCase(),
            size: item.Size,
            thumbnailUrl: originalUrl,
            originalUrl,
            dateCreated: item.LastModified,
            dateModified: item.LastModified,
            metadata: {
              contentType: metadata.ContentType,
              size: item.Size,
              ...metadata.Metadata,
            },
          };
        })
      );

      return {
        statusCode: 200,
        body: { assets },
      };
    } catch (error) {
      this.logger.error(error);
      return errorResponse(
        500,
        "Error searching assets: " + error.message,
        this.logger
      );
    }
  }

  async getAssetUrl(params) {
    try {
      this.logger.info("Getting presigned URL for asset");
      const url = await this.getS3PresignedUrl(params.assetId);
      return {
        statusCode: 200,
        body: { url },
      };
    } catch (error) {
      this.logger.error(error);
      return errorResponse(
        500,
        "Error getting asset URL: " + error.message,
        this.logger
      );
    }
  }

  async getAssetMetadata(params) {
    try {
      this.logger.info("Getting metadata for asset");
      const headCmd = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: params.assetId,
      });
      const metadata = await this.client.send(headCmd);

      return {
        statusCode: 200,
        body: {
          metadata: {
            contentType: metadata.ContentType,
            contentLength: metadata.ContentLength,
            lastModified: metadata.LastModified,
            ...metadata.Metadata,
          },
        },
      };
    } catch (error) {
      this.logger.error(error);
      return errorResponse(
        500,
        "Error getting asset metadata: " + error.message,
        this.logger
      );
    }
  }
}

module.exports = S3DamProvider;
