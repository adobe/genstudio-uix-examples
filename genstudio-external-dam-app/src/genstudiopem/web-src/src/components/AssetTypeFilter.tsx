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

import React, { useState, useEffect, FunctionComponent } from "react";
import { Key, View } from "@adobe/react-spectrum";
import { Picker, PickerItem } from "@react-spectrum/s2";
import FileText from "@react-spectrum/s2/icons/FileText";
import { IconProps } from "@react-spectrum/s2";

const FileTextIcon = FileText as FunctionComponent<IconProps>;

interface AssetTypeFilterProps {
  availableFileTypes: string[];
  onFilterChange: (fileTypes: string[]) => void;
  resetTrigger?: number;
}

const AssetTypeFilter: React.FC<AssetTypeFilterProps> = ({
  availableFileTypes,
  onFilterChange,
  resetTrigger = 0,
}) => {
  const [internalSelection, setInternalSelection] = useState<Key>("all");

  useEffect(() => {
    if (resetTrigger > 0) {
      setInternalSelection("all");
    }
  }, [resetTrigger]);

  const handleSelectionChange = (value: Key | null) => {
    if (value === null) return;
    const stringValue = String(value);
    setInternalSelection(value);
    
    if (stringValue === "all") {
      onFilterChange([]);
    } else {
      onFilterChange([stringValue]);
    }
  };

  const options = [
    { key: "all", label: "Asset type" },
    ...availableFileTypes.map((type) => ({
      key: type,
      label: type.toUpperCase(),
    })),
  ];

  return (
    <View UNSAFE_style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "6px",
      marginLeft: "40px",
      "--iconPrimary": "var(--spectrum-global-color-gray-800)"
    } as React.CSSProperties}>
      <div 
        style={{
          width: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <FileTextIcon />
      </div>
      
      <Picker
        selectedKey={internalSelection}
        onSelectionChange={handleSelectionChange}
        placeholder="Asset type"
        isQuiet={true}
        UNSAFE_style={{ 
          width: "auto",
          minWidth: "120px",
          "--text-color": "var(--spectrum-global-color-gray-800)"
        } as React.CSSProperties}
      >
        {options.map((option) => 
          React.createElement(PickerItem as any, { 
            key: option.key,
            id: option.key
          }, option.label)
        )}
      </Picker>
    </View>
  );
};

export default AssetTypeFilter;