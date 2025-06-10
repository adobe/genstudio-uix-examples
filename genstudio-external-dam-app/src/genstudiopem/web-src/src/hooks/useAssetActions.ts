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

import { useState, useCallback } from "react";
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
  const [baseAssets, setBaseAssets] = useState<DamAsset[]>([]);
  const [displayedAssets, setDisplayedAssets] = useState<DamAsset[]>([]);
  const [availableFileTypes, setAvailableFileTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractFileTypes = (assetList: DamAsset[]): string[] => {
    const fileTypes = assetList
      .map(asset => (asset.fileType || '').toUpperCase())
      .filter(type => type && type !== 'UNKNOWN')
      .filter((type, index, array) => array.indexOf(type) === index)
      .sort();
    
    return fileTypes;
  };

  const updateAvailableFileTypes = (assetList: DamAsset[]) => {
    const fileTypes = extractFileTypes(assetList);
    setAvailableFileTypes(fileTypes);
  };

  const fetchAssets = useCallback(async (
    params: AssetSearchParams = { limit: 100, offset: 0 }
  ) => {
    setIsLoading(true);
    setError(null);

    if (!auth) {
      console.warn("No authentication available, using mock assets for development");
      const mockAssets = getMockAssets();
      
      setBaseAssets(() => mockAssets);
      setDisplayedAssets(() => mockAssets);
      
      const fileTypes = extractFileTypes(mockAssets);
      setAvailableFileTypes(() => fileTypes);
      
      setIsLoading(false);
      return;
    }

    try {
      const url = actions[SEARCH_ASSETS_ACTION];
      const response = await actionWebInvoke(
        url,
        auth.imsToken,
        auth.imsOrg,
        params
      );

      if (response && typeof response === "object" && "assets" in response) {
        const validatedAssets = (response.assets as any[]).map(asset => ({
          id: asset.id || '',
          name: asset.name || 'Unknown',
          fileType: asset.fileType || 'UNKNOWN',
          thumbnailUrl: asset.thumbnailUrl || asset.url || '',
          url: asset.url || '',
          metadata: asset.metadata || {},
          dateCreated: asset.dateCreated || new Date().toISOString(),
          dateModified: asset.dateModified || new Date().toISOString(),
        }));
        setBaseAssets(validatedAssets);
        setDisplayedAssets(validatedAssets);
        
        if (response.availableFileTypes && Array.isArray(response.availableFileTypes)) {
          setAvailableFileTypes(response.availableFileTypes);
        } else {
          updateAvailableFileTypes(validatedAssets);
        }
      } else {
        const mockAssets = getMockAssets();
        setBaseAssets(mockAssets);
        setDisplayedAssets(mockAssets);
        updateAvailableFileTypes(mockAssets);
      }
    } catch (err) {
      console.warn("Error fetching assets:", err);
      setError("Failed to fetch assets. Please try again.");
      const mockAssets = getMockAssets();
      setBaseAssets(mockAssets);
      setDisplayedAssets(mockAssets);
      updateAvailableFileTypes(mockAssets);
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  const applySearchAndFilter = (searchTerm: string = "", fileTypes: string[] = []) => {
    let filteredAssets = baseAssets;

    if (searchTerm.trim()) {
      filteredAssets = baseAssets.filter((asset) => {
        const name = asset.name || '';
        const assetFileType = asset.fileType || '';
        const keywords = asset.metadata?.keywords || [];
        
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assetFileType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (Array.isArray(keywords) && 
           keywords.some((keyword: string) =>
             typeof keyword === 'string' && keyword.toLowerCase().includes(searchTerm.toLowerCase())
           ));
      });
    }

    if (fileTypes.length > 0) {
      filteredAssets = filteredAssets.filter((asset) => {
        const assetFileType = (asset.fileType || '').toUpperCase();
        return fileTypes.some(type => type.toUpperCase() === assetFileType);
      });
    }

    setDisplayedAssets(filteredAssets);
  };

  const searchAssets = (query: string) => {
    applySearchAndFilter(query, []);
  };

  const filterAssets = (fileTypes: string[] = [], currentSearchTerm: string = "") => {
    applySearchAndFilter(currentSearchTerm, fileTypes);
  };

  const resetToBaseAssets = () => {
    setDisplayedAssets(baseAssets);
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

    const assetNames = [
      "mountain-skier.jpeg",
      "winter-landscape.png", 
      "snowy-peaks.webp",
      "alpine-resort.jpg",
      "ski-equipment.png",
      "frozen-lake.jpeg",
      "winter-sports.webp",
      "snow-covered-trees.jpg",
      "mountain-cabin.png",
      "aurora-borealis.jpeg",
      "ice-crystals.webp",
      "winter-wildlife.jpg",
      "snowboard-action.png",
      "glacier-view.jpeg",
      "winter-sunset.webp"
    ];

    const fileTypes = ["JPEG", "PNG", "WEBP", "JPG"];

    const assetKeywords = [
      ["mountain", "skiing", "winter", "sport"],
      ["landscape", "winter", "nature", "scenic"], 
      ["peaks", "mountain", "snow", "alpine"],
      ["resort", "skiing", "vacation", "alpine"],
      ["equipment", "skiing", "gear", "sport"],
      ["lake", "frozen", "ice", "winter"],
      ["sports", "winter", "action", "recreation"],
      ["trees", "snow", "forest", "nature"],
      ["cabin", "mountain", "cozy", "retreat"],
      ["aurora", "northern lights", "sky", "nature"],
      ["ice", "crystals", "macro", "detail"],
      ["wildlife", "winter", "animals", "nature"],
      ["snowboard", "action", "sport", "extreme"],
      ["glacier", "ice", "mountain", "climate"],
      ["sunset", "winter", "sky", "evening"]
    ];

    const mockAssets = Array(15)
      .fill(null)
      .map((_, index) => {
        const urlIndex = index % urls.length;
        const fileType = fileTypes[index % fileTypes.length];
        return {
          id: `asset-${index + 1}`,
          name: assetNames[index],
          fileType: fileType,
          thumbnailUrl: urls[urlIndex],
          url: urls[urlIndex],
          metadata: {
            size: 1024 * 1024 * Math.floor(Math.random() * 10 + 1),
            keywords: assetKeywords[index] || []
          },
          dateCreated: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toISOString(),
          dateModified: new Date(
            Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
          ).toISOString(),
        };
      });

    return mockAssets;
  };

  return {
    assets: displayedAssets,
    availableFileTypes,
    isLoading,
    error,
    fetchAssets,
    searchAssets,
    filterAssets,
    getAssetPresignedUrl,
    getAssetMetadata,
    resetToBaseAssets,
  };
};
