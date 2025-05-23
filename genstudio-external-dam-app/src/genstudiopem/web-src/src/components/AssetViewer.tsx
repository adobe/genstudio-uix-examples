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
      const connection = await attach({ id: extensionId });
      setGuestConnection(connection);
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
    const { selectedAssets } =
      await ExtensionRegistrationService.selectContentExtensionSync(
        guestConnection
      );
    setSelectedAssets(
      selectedAssets
        ? selectedAssets?.map((asset: any) => convertToGenStudioAsset(asset))
        : []
    );
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

    if (guestConnection) {
      try {
        await ExtensionRegistrationService.selectContentExtensionSetSelectedAssets(
          guestConnection,
          extensionId,
          newSelectedAssets
        );
      } catch (error) {
        console.warn("===x Error sending selected assets to host:", error);
      }
    } else {
      console.log("===x Guest connection not available");
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
        columns={["1fr", "1fr", "1fr", "1fr", "1fr"]}
        autoRows="auto"
        gap="size-200"
      >
        {assets.map((asset) => renderAsset(asset))}
      </Grid>
    );
  };

  const renderAsset = (asset: DamAsset) => {
    return (
      <AssetCard
        key={asset.id}
        asset={asset}
        isSelected={selectedAssets?.some((a) => a.id === asset.id)}
        onSelect={handleAssetSelect}
      />
    );
  };

  return (
    <View height="100%" width="100%">
      <Flex direction="column" height="100%">
        <Flex
          direction="column"
          UNSAFE_style={{
            padding: "var(--spectrum-global-dimension-size-200)",
          }}
          gap="size-200"
        >
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            width="100%"
          />
        </Flex>
        <View flex={1} padding="size-200" overflow="auto">
          {renderAssetContent()}
        </View>
      </Flex>
    </View>
  );
}
