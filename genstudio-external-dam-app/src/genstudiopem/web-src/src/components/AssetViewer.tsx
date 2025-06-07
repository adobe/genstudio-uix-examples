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

import React, { useEffect, useState } from "react";
import {
  Flex,
  View,
  Grid,
  SearchField,
  ProgressCircle,
  Well,
} from "@adobe/react-spectrum";
import AssetCard from "./AssetCard";
import { useAssetActions } from "../hooks/useAssetActions";
import { extensionId } from "../Constants";
import { Asset, ExtensionRegistrationService } from "@adobe/genstudio-uix-sdk";
import { attach } from "@adobe/uix-guest";
import { DamAsset } from "../types";

export default function AssetViewer(): JSX.Element {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [auth, setAuth] = useState<any>(null);
  const { assets, isLoading, fetchAssets, searchAssets } =
    useAssetActions(auth);

  const [guestConnection, setGuestConnection] = useState<any>(null);

  const convertToGenStudioAsset = (asset: DamAsset): Asset => {
    return {
      id: asset.id,
      name: asset.name,
      signedUrl: asset.url,
      source: "S3",
      sourceUrl: asset.url,
    };
  };

  useEffect(() => {
    (async () => {
      try {
        const connection = await attach({ id: extensionId });
        setGuestConnection(connection);
      } catch (error) {
        console.warn(
          "Failed to attach to GenStudio host (likely running in standalone mode):",
          error
        );
        setGuestConnection(null);
      }
    })();
  }, [extensionId]);

  useEffect(() => {
    const sharedAuth = guestConnection?.sharedContext.get("auth");
    if (sharedAuth) {
      setAuth(sharedAuth);
    }
    syncState();
  }, [guestConnection]);

  const syncState = async () => {
    if (!guestConnection) return;

    try {
      const { selectedAssets } =
        await ExtensionRegistrationService.selectContentExtensionSync(
          guestConnection
        );
      setSelectedAssets(
        selectedAssets
          ? selectedAssets?.map((asset: any) => convertToGenStudioAsset(asset))
          : []
      );
    } catch (error) {
      console.warn("Failed to sync state with GenStudio host:", error);
    }
  };

  useEffect(() => {
    // Load assets when component mounts
    if (auth) fetchAssets();
  }, [auth]);

  useEffect(() => {
    // Search assets when search term changes
    if (searchTerm) {
      const delaySearch = setTimeout(() => {
        searchAssets(searchTerm);
      }, 500);
      return () => clearTimeout(delaySearch);
    } else {
      fetchAssets();
    }
  }, [searchTerm, auth]);

  const handleAssetSelect = async (asset: DamAsset) => {
    const { selectionLimit } =
      await ExtensionRegistrationService.selectContentExtensionSync(
        guestConnection
      );

    const isSelected = selectedAssets.some((a) => a.id === asset.id);

    let newSelectedAssets: Asset[] = [...selectedAssets];

    if (isSelected) {
      newSelectedAssets = selectedAssets.filter((a) => a.id !== asset.id);
    } else if (selectedAssets.length < selectionLimit) {
      newSelectedAssets = [...selectedAssets, convertToGenStudioAsset(asset)];
    }

    setSelectedAssets(newSelectedAssets);

    if (!guestConnection) return;

    try {
      await ExtensionRegistrationService.selectContentExtensionSetSelectedAssets(
        guestConnection,
        extensionId,
        newSelectedAssets
      );
    } catch (error) {
      console.warn("===x Error sending selected assets to host:", error);
    }
  };

  const renderAssetContent = () => {
    if (isLoading) {
      return (
        <Flex alignItems="center" justifyContent="center" height="100%">
          <ProgressCircle aria-label="Loading assets" isIndeterminate />
        </Flex>
      );
    }

    if (assets.length === 0) {
      return <Well>No assets found. Try a different search term.</Well>;
    }

    return (
      <Grid
        columns="repeat(auto-fill, 230px)"
        autoRows="auto"
        justifyContent="center"
        gap="size-300"
        width="100%"
      >
        {assets.map((asset) => renderAsset(asset))}
      </Grid>
    );
  };

  useEffect(() => {
    const getExternalAssets = async () => {
      const { selectedExternalAssets } =
        await ExtensionRegistrationService.selectContentExtensionSync(
          guestConnection
        );

      if (selectedExternalAssets && selectedExternalAssets.assets) {
        const externalAssets = selectedExternalAssets.assets.map((asset: any) =>
          convertToGenStudioAsset(asset)
        );
        setSelectedAssets((prevAssets) => {
          const localAssets = prevAssets.filter(
            (asset) =>
              !externalAssets.some(
                (extAsset: Asset) => extAsset.id === asset.id
              )
          );
          return [...localAssets, ...externalAssets];
        });
      }
    };
    if (guestConnection) {
      getExternalAssets();
    }
  }, [guestConnection]);

  const renderAsset = (asset: DamAsset) => {
    const isSelected = selectedAssets?.some((a) => a.id === asset.id);

    return (
      <AssetCard
        key={asset.id}
        asset={asset}
        isSelected={isSelected}
        onSelect={handleAssetSelect}
      />
    );
  };

  return (
    <View height="100%" width="100%">
      <style>
        {`
          .search-field-custom input[type="search"] {
            border-radius: 16px !important;
            border: 2px solid var(--Palette-gray-300, #DADADA) !important;
            background: var(--Palette-gray-25, #FFF) !important;
          }
        `}
      </style>
      <Flex direction="column" height="100%">
        <View
          UNSAFE_style={{ backgroundColor: "var(--spectrum-gray-100)" }}
          padding="size-300"
        >
          <Flex direction="row" justifyContent="center" alignItems="center">
            <SearchField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search for assets"
              width="400px"
              maxWidth="90%"
              UNSAFE_className="search-field-custom"
            />
          </Flex>
        </View>

        <View
          flex={1}
          UNSAFE_style={{ backgroundColor: "var(--spectrum-gray-100)" }}
          padding="size-300"
          overflow="auto"
        >
          {renderAssetContent()}
        </View>
      </Flex>
    </View>
  );
}
