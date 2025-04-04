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

import React, { useEffect, useState } from 'react';
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
} from '@adobe/react-spectrum';
import Filter from '@spectrum-icons/workflow/Filter';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';
import { Asset } from '../types';
import AssetCard from './AssetCard';
import { useAssetActions } from '../hooks/useAssetActions';
import { useGuestConnection } from '../hooks/useGuestConnection';
import { extensionId } from '../Constants';
interface AssetViewerProps {
  onAssetSelect: (assets: Asset[]) => void;
  onClose: () => void;
}

const AssetViewer: React.FC<AssetViewerProps> = ({ onAssetSelect, onClose }) => {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    assets, 
    isLoading, 
    fetchAssets, 
    searchAssets,
    auth
  } = useAssetActions();
  const guestConnection = useGuestConnection(extensionId);

  useEffect(() => {
    // Load assets when component mounts
    fetchAssets();
  }, [auth, useGuestConnection]);

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

  const handleAssetSelect = async(asset: Asset) => {
    if (selectedAssets.some(a => a.id === asset.id)) {
      // remove asset from selected assets
      console.log("removing asset", asset.id);
      const newSelectedAssets = selectedAssets.filter(a => a.id !== asset.id);
      setSelectedAssets(newSelectedAssets);
      if (guestConnection) {
        await guestConnection.host.api?.contentSelectContentDialog.setSelectedAssets(newSelectedAssets);
      }
    } else {
      // add asset to selected assets
      console.log("adding asset", asset.id);
      const newSelectedAssets = [...selectedAssets, asset];
      setSelectedAssets(newSelectedAssets);
      if (guestConnection) {
        // send selected assets to host
        await guestConnection.host.api?.contentSelectContentDialog.setSelectedAssets(newSelectedAssets);
      }
    }
  };

  const handleUseSelected = () => {
    onAssetSelect(selectedAssets);
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
        columns={['1fr', '1fr', '1fr', '1fr', '1fr']}
        autoRows="auto"
        gap="size-200"
      >
        {assets.map((asset) => (
          <AssetCard 
            key={asset.id} 
            asset={asset} 
            isSelected={selectedAssets.some(a => a.id === asset.id)} 
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
        <Flex direction="column" UNSAFE_style={{padding: "var(--spectrum-global-dimension-size-200)"}} gap="size-200">
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
};

export default AssetViewer; 