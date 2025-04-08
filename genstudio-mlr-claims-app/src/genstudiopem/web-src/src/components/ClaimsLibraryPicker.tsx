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

import { Item, Picker } from "@adobe/react-spectrum";
import React, { Key } from "react";

import { TEST_CLAIMS } from "../Constants";

interface ClaimsCheckerProps {
  handleSelectionChange: (library: Key | null) => void;
}

export const ClaimsLibraryPicker: React.FC<ClaimsCheckerProps> = ({
  handleSelectionChange,
}) => {
  return (
    <Picker
      placeholder="Select Claims Category..."
      width="100%"
      onSelectionChange={handleSelectionChange}
    >
      {TEST_CLAIMS.map((library) => (
        <Item key={library.id}>{library.name}</Item>
      ))}
    </Picker>
  );
};
