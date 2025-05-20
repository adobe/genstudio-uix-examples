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

import { useState } from "react";
import { AssetSearchParams, DamAsset } from "../types";
import { actionWebInvoke } from "../utils/actionWebInvoke";
import actions from "../config.json";

interface Auth {
  imsToken: string;
  imsOrg: string;
}

// Define constants for our action endpoints
const SEARCH_ASSETS_ACTION = "genstudio-external-dam-app/search";
const GET_ASSET_URL_ACTION = "genstudio-external-dam-app/get-asset-url";
const GET_ASSET_METADATA_ACTION =
  "genstudio-external-dam-app/get-asset-metadata";

export const useAssetActions = (auth: Auth) => {
  const [assets, setAssets] = useState<DamAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all assets (or with pagination)
  const fetchAssets = async (
    params: AssetSearchParams = { limit: 20, offset: 0 }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!auth) {
        throw new Error("Authentication not found");
      }

      const url = actions[SEARCH_ASSETS_ACTION];
      const response = await actionWebInvoke(
        url,
        auth.imsToken,
        auth.imsOrg,
        params
      );

      if (response && typeof response === "object" && "assets" in response) {
        setAssets(response.assets as DamAsset[]);
      } else {
        setAssets(getMockAssets());
      }
    } catch (err) {
      console.warn("Error fetching assets:", err);
      setError("Failed to fetch assets. Please try again.");
      // Use mock data in case of error
      setAssets(getMockAssets());
    } finally {
      setIsLoading(false);
    }
  };

  // Search assets by query
  const searchAssets = async (
    query: string,
    params: Omit<AssetSearchParams, "query"> = {}
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!auth) {
        throw new Error("Authentication not found");
      }
      const response = await actionWebInvoke(
        actions[SEARCH_ASSETS_ACTION],
        auth.imsToken,
        auth.imsOrg,
        { query, ...params }
      );

      if (response && typeof response === "object" && "assets" in response) {
        setAssets(response.assets as DamAsset[]);
      } else {
        // Filter mock data if no real backend
        const filteredMockAssets = getMockAssets().filter(
          (asset) =>
            asset.name.toLowerCase().includes(query.toLowerCase()) ||
            asset.metadata.keywords?.some((keyword: string) =>
              keyword.toLowerCase().includes(query.toLowerCase())
            )
        );
        setAssets(filteredMockAssets);
      }
    } catch (err) {
      console.error("Error searching assets:", err);
      setError("Failed to search assets. Please try again.");
      // Filter mock data in case of error
      const filteredMockAssets = getMockAssets().filter((asset) =>
        asset.name.toLowerCase().includes(query.toLowerCase())
      );
      setAssets(filteredMockAssets);
    } finally {
      setIsLoading(false);
    }
  };

  // Get a presigned URL for an asset
  const getAssetPresignedUrl = async (
    assetId: string
  ): Promise<string | null> => {
    try {
      if (!auth) {
        throw new Error("Authentication not found");
      }
      const response = await actionWebInvoke(
        actions[GET_ASSET_URL_ACTION],
        auth.imsToken,
        auth.imsOrg,
        { assetId }
      );

      if (response && typeof response === "object" && "url" in response) {
        return response.url as string;
      }
      return null;
    } catch (err) {
      console.error("Error getting asset URL:", err);
      setError("Failed to get asset URL. Please try again.");
      return null;
    }
  };

  // Get asset metadata
  const getAssetMetadata = async (assetId: string) => {
    try {
      if (!auth) {
        throw new Error("Authentication not found");
      }
      const response = await actionWebInvoke(
        actions[GET_ASSET_METADATA_ACTION],
        auth.imsToken,
        auth.imsOrg,
        { assetId }
      );

      if (response && typeof response === "object" && "metadata" in response) {
        return response.metadata;
      }
      return null;
    } catch (err) {
      console.error("Error getting asset metadata:", err);
      setError("Failed to get asset metadata. Please try again.");
      return null;
    }
  };

  // Helper function to generate mock assets for development
  const getMockAssets = (): DamAsset[] => {
    const urls = [
      "https://thumbnails.findmy.media/09bb4a3c-99f8-4009-a319-e905f3303b7a/binaries/94f02dafcd309234d22f29ee9beb5d6d206736c4ba9af6cc9df9094d14a0d505/rendition-hq.webp",
      "https://thumbnails.findmy.media/09bb4a3c-99f8-4009-a319-e905f3303b7a/binaries/950697e8a1ee984434ee252b8fc462dd0769b054f403d5794ae6c39b19ebf322/rendition-hq.webp",
      "https://thumbnails.findmy.media/09bb4a3c-99f8-4009-a319-e905f3303b7a/binaries/750ac90bf833b71b5c1db89123cb95e3881c1cd0baabadbf0491996acc4744b0/rendition-hq.webp",
    ];

    return Array(3)
      .fill(null)
      .map((_, index) => {
        return {
          id: `asset-${index + 1}`,
          name: `skier.jpeg`,
          fileType: "JPEG",
          thumbnailUrl: urls[index],
          url: urls[index],
          metadata: {
            size: 1024 * 1024 * Math.floor(Math.random() * 10 + 1),
          },
          dateCreated: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toISOString(),
          dateModified: new Date(
            Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
          ).toISOString(),
        };
      });
  };

  return {
    assets,
    isLoading,
    error,
    fetchAssets,
    searchAssets,
    getAssetPresignedUrl,
    getAssetMetadata,
  };
};
