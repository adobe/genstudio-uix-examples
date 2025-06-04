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

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const DamProvider = require("../DamProvider");

class S3DamProvider extends DamProvider {
  constructor(params, logger) {
    super(params, logger);
    this.client = new S3Client({
      credentials: {
        accessKeyId: params.AWS_ACCESS_KEY_ID,
        secretAccessKey: params.AWS_SECRET_ACCESS_KEY,
      },
      region: params.AWS_REGION,
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

  async getThumbnailUrl(key) {
    const thumbnailKey = "thumbnails/" + key.replace('assets/', '').replace(/\.[^/.]+$/, ".jpg");
    return await this.getS3PresignedUrl(thumbnailKey);
  }

  async searchAssets(params) {
    this.logger.info("Searching assets in S3");
    const listObjectsCmd = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: 'assets/',
      MaxKeys: parseInt(params.limit) || 100,
    });
    const listResult = await this.client.send(listObjectsCmd);
    this.logger.info(`Found ${listResult?.Contents?.length || 0} assets in S3`);

    const assets = (await Promise.all(
      listResult?.Contents?.map(async (item) => {
        if (item.Key.endsWith('/')) return null;
        const headObjCmd = new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: item.Key,
        });
        try {
          const metadata = await this.client.send(headObjCmd);
          const originalUrl = await this.getS3PresignedUrl(item.Key);
          const thumbnailUrl = await this.getThumbnailUrl(item.Key);
          return {
            id: item.Key,
            name: item.Key.split("/").pop() || "Unknown",
            fileType: item.Key.split(".").pop()?.toUpperCase() || "UNKNOWN",
            size: item.Size,
            thumbnailUrl: thumbnailUrl,
            url: originalUrl,
            dateCreated: item.LastModified?.toISOString() || new Date().toISOString(),
            dateModified: item.LastModified?.toISOString() || new Date().toISOString(),
            metadata: {
              contentType: metadata.ContentType,
              size: item.Size,
              ...metadata.Metadata,
            },
          };
        } catch (error) {
          this.logger.error(`Error getting metadata for asset ${item.Key}: ${error}`);
          return null;
        }
      })
    )).filter(asset => asset !== null);

    return {
      statusCode: 200,
      body: { 
        assets: assets,
        availableFileTypes: [...new Set(assets.map(asset => asset.fileType).filter(type => type && type !== 'UNKNOWN'))].sort()
      },
    };
  }

  async doGetAssetUrl(params) {
    this.logger.info("Getting presigned URL for asset", params.assetId);
    const url = await this.getS3PresignedUrl(params.assetId);
    return { statusCode: 200, body: { url } };
  }

  async doGetAssetMetadata(params) {
    this.logger.info("Getting metadata for asset", params.assetId);
    const headObjCmd = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: params.assetId,
    });
    const metadata = await this.client.send(headObjCmd);

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
  }
}

module.exports = S3DamProvider;
