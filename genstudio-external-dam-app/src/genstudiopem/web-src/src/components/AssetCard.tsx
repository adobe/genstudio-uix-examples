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

import React from 'react';
import { 
  View, 
  Image, 
  Text,
  Checkbox
} from '@adobe/react-spectrum';
import { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onSelect: (asset: Asset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, isSelected, onSelect }) => {
  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)}KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <View
      borderWidth="thin"
      borderColor={isSelected ? 'blue-400' : 'gray-200'}
      borderRadius="medium"
      overflow="hidden"
      UNSAFE_style={{ cursor: 'pointer', position: 'relative' }}
    >
      {/* Image container */}
      <View height="size-3000" position="relative" onClick={() => onSelect(asset)}>
        <Image 
          src={asset.thumbnailUrl} 
          alt={asset.name}
          objectFit="cover" 
          width="100%" 
          height="100%" 
        />
        
        {/* File type badge */}
        <View 
          position="absolute" 
          bottom="size-50" 
          right="size-50" 
          backgroundColor="gray-700" 
          padding="size-50" 
          borderRadius="small"
        >
          <Text UNSAFE_style={{ color: 'white', fontSize: '12px' }}>{asset.fileType}</Text>
        </View>
        
        {/* Selection checkbox - positioned at top-left */}
        <View
          position="absolute"
          top="size-100"
          left="size-100"
        >
          <Checkbox
            isSelected={isSelected}
            onChange={() => onSelect(asset)}
            UNSAFE_className="asset-selection-checkbox"
          />
        </View>
      </View>
      
      {/* Asset info section */}
      <View padding="size-150" backgroundColor="gray-50">
        <Text UNSAFE_style={{ fontSize: '14px', lineHeight: '18px', display: 'block' }}>
          {asset.name}
        </Text>
        <View marginTop="size-50">
          <Text UNSAFE_style={{ fontSize: '12px', color: 'var(--spectrum-global-color-gray-700)' }}>
           {asset.metadata.contentType} • {formatFileSize(asset.metadata?.size || 0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AssetCard; 