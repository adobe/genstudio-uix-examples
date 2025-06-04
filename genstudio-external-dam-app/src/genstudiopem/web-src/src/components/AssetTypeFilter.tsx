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

import React, { useState, useEffect } from "react";
import { Picker, Item, Key } from "@adobe/react-spectrum";

interface AssetTypeFilterProps {
  availableFileTypes: string[];
  onFilterChange: (fileTypes: string[]) => void;
  resetTrigger?: number;
}

const AssetTypeFilter: React.FC<AssetTypeFilterProps> = ({ 
  availableFileTypes, 
  onFilterChange,
  resetTrigger = 0
}) => {
  const [selectedFileType, setSelectedFileType] = useState<Key>("all");

  useEffect(() => {
    if (resetTrigger > 0) {
      setSelectedFileType("all");
    }
  }, [resetTrigger]);

  const fileTypeOptions = [
    { key: "all", label: "All types" },
    ...availableFileTypes.map(type => ({
      key: type.toLowerCase(),
      label: type
    }))
  ];

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) return;
    
    setSelectedFileType(key);
    
    if (key === "all") {
      onFilterChange([]);
    } else {
      onFilterChange([key as string]);
    }
  };

  if (availableFileTypes.length === 0) {
    return null;
  }

  return (
    <Picker
      label="Asset type"
      selectedKey={selectedFileType}
      onSelectionChange={handleSelectionChange}
      width="size-2000"
      labelPosition="side"
      labelAlign="start"
    >
      {fileTypeOptions.map((option) => (
        <Item key={option.key} textValue={option.label}>
          {option.label}
        </Item>
      ))}
    </Picker>
  );
};

export default AssetTypeFilter; 