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
  Text,
  Grid,
  SearchField,
  ButtonGroup,
  Button,
  ProgressCircle,
  Tabs,
  TabList,
  Item,
  Well,
} from "@adobe/react-spectrum";
import Filter from "@spectrum-icons/workflow/Filter";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import AssetCard from "./AssetCard";
import { useAssetActions } from "../hooks/useAssetActions";
import { useGuestConnection } from "../hooks/useGuestConnection";
import { extensionId } from "../Constants";
import {
  Asset,
  ExtensionRegistrationService,
  Auth,
} from "@adobe/genstudio-uix-sdk";
import { attach } from "@adobe/uix-guest";

export default function AssetViewer(): JSX.Element {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [auth, setAuth] = useState<Auth | null>(null);
  const { assets, isLoading, fetchAssets, searchAssets } =
    useAssetActions(auth);
  // const guestConnection = useGuestConnection(extensionId);

  const [guestConnection, setGuestConnection] = useState<any>(null);

  useEffect(() => {
    (async () => {
      console.log("===x attaching to extension", extensionId);
      const connection = await attach({ id: extensionId });
      console.log("===x connection", connection);
      setGuestConnection(connection);
    })();
  }, [extensionId]);

  useEffect(() => {
    console.log("===x useGuestConnection guestConnection", guestConnection);
    const sharedAuth = guestConnection?.sharedContext.get("auth");
    if (sharedAuth) {
      setAuth(sharedAuth as Auth);
    }
  }, [guestConnection]);

  useEffect(() => {
    // Load assets when component mounts
    console.log("===x useEffect auth", auth);
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

  const handleAssetSelect = async (asset: Asset) => {
    // Check if asset is already selected
    const isSelected = selectedAssets.some((a) => a.id === asset.id);

    // Create new array of selected assets based on selection state
    const newSelectedAssets = isSelected
      ? selectedAssets.filter((a) => a.id !== asset.id) // Remove asset
      : [...selectedAssets, asset]; // Add asset

    // Update local state
    setSelectedAssets(newSelectedAssets);

    // Log for debugging
    console.log(
      `===x ${isSelected ? "Removing" : "Adding"} asset: ${asset.id}`
    );

    // Update host application if connection is available

    console.log("===x handleAssetSelect guestConnection", guestConnection);
    if (guestConnection) {
      try {
        const { assets, extensionID } =
          await ExtensionRegistrationService.setSelectContentSelectedAssets(
            guestConnection,
            newSelectedAssets,
            extensionId // Using extensionId instead of hardcoded string
          );
        console.log(
          "===x Successfully updated selected assets in host",
          assets,
          extensionID
        );
      } catch (error) {
        console.error("===x Error sending selected assets to host:", error);
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
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            isSelected={selectedAssets.some((a) => a.id === asset.id)}
            onSelect={handleAssetSelect}
          />
        ))}
      </Grid>
    );
  };

  return (
    // backgroundColor="gray-100"
    <View height="100%" width="100%">
      <Flex direction="column" height="100%">
        {/* Tabs and Search */}
        <Flex
          direction="column"
          UNSAFE_style={{
            padding: "var(--spectrum-global-dimension-size-200)",
          }}
          gap="size-200"
        >
          <Tabs>
            <TabList>
              <Item key="assets">Assets</Item>
              <Item key="collections">Collections</Item>
            </TabList>
          </Tabs>

          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            width="100%"
          />

          {/* Filter buttons */}
          <Flex direction="row" gap="size-100">
            <ButtonGroup>
              <Button variant="secondary" alignSelf="start">
                <Flex alignItems="center" gap="size-100">
                  <Filter />
                  <Text>Assets</Text>
                  <ChevronDown />
                </Flex>
              </Button>
              <Button variant="secondary">
                <Flex alignItems="center" gap="size-100">
                  <Text>Asset type</Text>
                  <ChevronDown />
                </Flex>
              </Button>
              <Button variant="secondary">
                <Flex alignItems="center" gap="size-100">
                  <Text>Tags</Text>
                  <ChevronDown />
                </Flex>
              </Button>
            </ButtonGroup>
          </Flex>
        </Flex>

        {/* Assets Grid */}
        <View flex={1} padding="size-200" overflow="auto">
          {renderAssetContent()}
        </View>

        {/* Footer */}
        {/* this all exists in ContentSelector */}
        {/* <Flex direction="row" justifyContent="space-between" alignItems="center" UNSAFE_style={{padding: "var(--spectrum-global-dimension-size-200)"}}>
          <Text>{selectedAssets.length} of {selectedAssets.length} selected</Text>
          <ButtonGroup>
            <Button variant="secondary" onPress={onClose}>Cancel</Button>
            <Button 
              variant="cta" 
              onPress={handleUseSelected} 
              isDisabled={selectedAssets.length === 0}
            >
              Use
            </Button>
          </ButtonGroup>
        </Flex> */}
      </Flex>
    </View>
  );
}
