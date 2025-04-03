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

const { Core } = require('@adobe/aio-sdk');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils');
const { S3Client, ListObjectsV2Command, HeadObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const filesLib = require('@adobe/aio-lib-files');

// bucket name: genstudio-uix-external-dam-demo


// Configure AWS S3
const configureBucketAccess = (params) => {
  
  // These would need to be set securely as environment variables or through Adobe I/O Runtime parameters
  const client = new S3Client({ 
    credentials: {
      accessKeyId: params.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: params.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: params.AWS_REGION || process.env.AWS_REGION || 'us-east-1' 
  });
  
  const bucketName = params.S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;
  
  return { client, bucketName };
}

async function getS3PresignedUrl(s3Client, key, bucketName) {
  const getObjCmd = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });
  return await getSignedUrl(s3Client, getObjCmd, { expiresIn: 3600 });
}

async function getThumbnailUrl(s3Client, files, key, bucketName, logger) {
  
  try {
    logger.info('Getting thumbnail URL for asset');
    if (files.exists(`public/${key}`)) {
      logger.info('File exists in Adobe I/O Files, generating presigned URL');
      const fileProps = await files.generatePresignedUrl(`public/${key}`, {
        urlType: 'external',
        expiryInSeconds: 3600
      });
      return fileProps.url;
    } else {
      logger.info('File does not exist in Adobe I/O Files, downloading from S3');
      // download the file from s3
      const getObjCmd = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
      });
      const s3Response = await s3Client.send(getObjCmd);
      // upload the file to adobe i/o files
      await files.write(`public/${key}`, s3Response.Body, {
        contentType: s3Response.ContentType
      });
      const fileProps = await files.generatePresignedUrl(`public/${key}`, {
        urlType: 'external',
        expiryInSeconds: 3600
      });
      return fileProps.url;
    }
  } catch (error) {
    logger.error(error);
    return errorResponse(500, 'Error getting thumbnail URL: ' + error.message, logger);
  }
}

// Search Assets Action
async function searchAssets(params) {
  const logger = Core.Logger('searchAssets', { level: params.LOG_LEVEL || 'info' });
  
  try {
    logger.debug(stringParameters(params));
    
    // Initialize both Files SDK and S3 client
    // const files = await filesLib.init();
    const { client, bucketName } = configureBucketAccess(params);
    
    // List objects from S3 first (to ensure we see all assets)
    const listObjectsCmd = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: params.prefix || '',
      MaxKeys: parseInt(params.limit) || 100
    });
    
    const listResult = await client.send(listObjectsCmd);
    logger.info(`Found ${listResult?.Contents?.length || 0} assets in S3`);
    
    // Process the returned objects
    const assets = await Promise.all(listResult?.Contents.map(async (item) => {
      // Get metadata from S3
      const headCmd = new HeadObjectCommand({
        Bucket: bucketName,
        Key: item.Key
      });
      const metadata = await client.send(headCmd);
      
      const originalUrl = await getS3PresignedUrl(client, item.Key, bucketName);
      const thumbnailUrl = originalUrl;
      // const thumbnailUrl = await getThumbnailUrl(client, files, item.Key, bucketName);

      
      return {
        id: item.Key,
        name: item.Key.split('/').pop(),
        fileType: item.Key.split('.').pop().toUpperCase(),
        size: item.Size,
        thumbnailUrl,
        originalUrl,
        dateCreated: item.LastModified,
        dateModified: item.LastModified,
        metadata: {
          contentType: metadata.ContentType,
          size: item.Size,
          ...metadata.Metadata
        }
      };
    }));
    
    return {
      statusCode: 200,
      body: { assets }
    };
  } catch (error) {
    logger.error(error);
    return errorResponse(500, 'Error searching assets: ' + error.message, logger);
  }
}

// Get Presigned URL Action
async function getAssetUrl(params) {
  const logger = Core.Logger('getAssetUrl', { level: params.LOG_LEVEL || 'info' })
  
  try {
    logger.info('Getting presigned URL for asset')
    logger.debug(stringParameters(params))
    
    // Check required parameters
    const requiredParams = ['assetId']
    const requiredHeaders = ['Authorization']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      return errorResponse(400, errorMessage, logger)
    }
    
    // Initialize both Files SDK and S3 client
    const { client, bucketName } = configureBucketAccess(params);
    const url = await getS3PresignedUrl(client, params.assetId, bucketName)
    
    return {
      statusCode: 200,
      body: { url }
    }
  } catch (error) {
    logger.error(error)
    return errorResponse(500, 'Error getting asset URL: ' + error.message, logger)
  }
}

// Get Asset Metadata Action
async function getAssetMetadata(params) {
  const logger = Core.Logger('getAssetMetadata', { level: params.LOG_LEVEL || 'info' })
  
  try {
    logger.info('Getting metadata for asset')
    logger.debug(stringParameters(params))
    
    // Check required parameters
    const requiredParams = ['assetId']
    const requiredHeaders = ['Authorization']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      return errorResponse(400, errorMessage, logger)
    }
    
    const { client, bucketName } = configureBucketAccess(params)
    
    // Get the object metadata
    const headCmd = new HeadObjectCommand({
      Bucket: bucketName,
      Key: params.assetId
  });
    const metadata = await client.send(headCmd);
    
    return {
      statusCode: 200,
      body: {
        metadata: {
          contentType: metadata.ContentType,
          contentLength: metadata.ContentLength,
          lastModified: metadata.LastModified,
          ...metadata.Metadata
        }
      }
    }
  } catch (error) {
    logger.error(error)
    return errorResponse(500, 'Error getting asset metadata: ' + error.message, logger)
  }
}

// Export the actions
exports.main = async (params) => {
  // Get the action type from the parameters
  const actionType = params.actionType || 'search'
  
  switch (actionType) {
    case 'search':
      return searchAssets(params)
    case 'getUrl':
      return getAssetUrl(params)
    case 'getMetadata':
      return getAssetMetadata(params)
    default:
      return errorResponse(400, `Unsupported action type: ${actionType}`, console)
  }
} 