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
} from '@adobe/react-spectrum';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onSelect: (asset: Asset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, isSelected, onSelect }) => {
  return (
    <View
      borderWidth="thin"
      borderColor={isSelected ? 'blue-400' : 'gray-200'}
      borderRadius="medium"
      overflow="hidden"
      UNSAFE_style={{ cursor: 'pointer', position: 'relative' }}
      onClick={() => onSelect(asset)}
    >
      <View height="size-3000" position="relative">
        <Image 
          src={asset.thumbnailUrl} 
          alt={asset.name}
          objectFit="cover" 
          width="100%" 
          height="100%" 
        />
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
        
        {isSelected && (
          <View 
            position="absolute" 
            top="size-100" 
            right="size-100"
            backgroundColor="blue-500"
            width="size-300"
            height="size-300"
            UNSAFE_style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Checkmark size="S" />
          </View>
        )}
      </View>
      <View padding="size-100">
        <Text>{asset.name}</Text>
      </View>
    </View>
  );
};

export default AssetCard; 