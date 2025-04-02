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
const { S3Client, ListObjectsV2, HeadObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const filesLib = require('@adobe/aio-lib-files');

// bucket name: genstudio-uix-external-dam-demo


// Configure AWS S3
const configureBucketAccess = (params) => {
  // These would need to be set securely as environment variables or through Adobe I/O Runtime parameters
  const client = new S3Client({ 
    accessKeyId: params.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: params.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
    region: params.AWS_REGION || process.env.AWS_REGION || 'us-east-1' });
  const bucketName = params.S3_BUCKET_NAME || process.env.S3_BUCKET_NAME
  
  return { client, bucketName }
}

// Search Assets Action
async function searchAssets(params) {
  const logger = Core.Logger('searchAssets', { level: params.LOG_LEVEL || 'info' })
  
  try {
    logger.info('Searching assets in S3')
    logger.debug(stringParameters(params))
    
    // Check required parameters
    const requiredParams = []
    const requiredHeaders = ['Authorization']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      return errorResponse(400, errorMessage, logger)
    }
    
    const { client, bucketName } = configureBucketAccess(params)
    
    // Create the search query based on parameters
    const prefix = params.prefix || ''
    const limit = parseInt(params.limit) || 100
    
    // List objects from S3
    const listObjectsCmd = new ListObjectsV2({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: limit
    });
    
    const listResult = await client.send(listObjectsCmd);
    
    // Process the returned objects
    const assets = await Promise.all(listResult.Contents.map(async (item) => {
      const headCmd = new HeadObjectCommand({
        Bucket: bucketName,
        key: item.Key
      })
      const metadata = await client.send(headCmd);
      
      // Create a temporary URL for the thumbnail
      const getObjCmd = new GetObjectCommand({
        Bucket: bucketName,
        Key: item.Key
      });
      const thumbnailUrl = await getSignedUrl(client, getObjCmd, { expiresIn: 3600});
      
      return {
        id: item.Key,
        name: item.Key.split('/').pop(),
        fileType: item.Key.split('.').pop().toUpperCase(),
        size: item.Size,
        thumbnailUrl: thumbnailUrl,
        originalUrl: thumbnailUrl,
        dateCreated: item.LastModified,
        dateModified: item.LastModified,
        metadata: {
          contentType: metadata.ContentType,
          size: item.Size,
          ...metadata.Metadata
        }
      }
    }))
    
    return {
      statusCode: 200,
      body: {
        assets
      }
    }
  } catch (error) {
    logger.error(error)
    return errorResponse(500, 'Error searching assets: ' + error.message, logger)
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
    
    const { client, bucketName } = configureBucketAccess(params);

    // Create a temporary URL for the thumbnail
    const getObjCmd = new GetObjectCommand({
      Bucket: bucketName,
      Key: params.assetId
    });
    const url = await getSignedUrl(client, getObjCmd, { expiresIn: 3600});

    return {
      statusCode: 200,
      body: {
        url
      }
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