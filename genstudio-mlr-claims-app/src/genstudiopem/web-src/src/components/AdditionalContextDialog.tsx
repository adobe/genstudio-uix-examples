/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */


import React, { useEffect, useState } from 'react';
import { attach } from "@adobe/uix-guest";
import { extensionId, TEST_CLAIMS } from "../Constants";
import { Provider, defaultTheme, Flex, Item, Divider, SearchField, Checkbox, Key, Button, Picker, View } from '@adobe/react-spectrum';
import { Claim, AdditionalContextTypes, GenerationContextService, AdditionalContext } from '@adobe/genstudio-uix-sdk';

export default function AdditionalContextDialog(): JSX.Element {
  const [guestConnection, setGuestConnection] = useState<any>(null);
  const [selectedClaimLibrary, setSelectedClaimLibrary] = useState<Key>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [claimsList, setClaimsList] = useState<Claim[]>([]);
  const [filteredClaimsList, setFilteredClaimsList] = useState<Claim[]>([]);
  const [selectedClaims, setSelectedClaims] = useState<Claim[]>([]);

  useEffect(() => {
    (async () => {
      const connection = await attach({ id: extensionId });
      setGuestConnection(connection as any);
    })();
  }, []);

  const handleClaimsLibrarySelection = (library: Key | null) => {
    if (library === null) return;
    setSelectedClaimLibrary(library);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleClaimChange = (claim: Claim) => {
    setSelectedClaims(prev =>
      prev.some(c => c.id === claim.id) ? prev.filter(c => c.id !== claim.id) : [...prev, claim]
    );
  };

  useEffect(() => {
    const filteredClaims = TEST_CLAIMS.find(library => library.id === selectedClaimLibrary)?.claims.filter(claim =>
      claim.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    setClaimsList(filteredClaims);
    setFilteredClaimsList(filteredClaims);
  }, [selectedClaimLibrary]);

  useEffect(() => {
    const filteredClaims = claimsList.filter(claim =>
      claim.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    setFilteredClaimsList(filteredClaims);
  }, [searchTerm]);

  return (
    <Provider theme={defaultTheme}>
      <View backgroundColor="static-white" height="100vh">
      <Flex direction="column" gap="size-300">
        <Picker
          label="Select a claim library"
          width="100%"
          onSelectionChange={handleClaimsLibrarySelection}
        >
          {TEST_CLAIMS.map(library => (
            <Item key={library.id}>{library.name}</Item>
          ))}
        </Picker>
        <Divider size="S" />
        <SearchField
          label="Search Claims"
          width="100%"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Flex direction="column" gap="size-100">
          {filteredClaimsList.map(claim => (
            <Checkbox
              key={claim.id}
              isSelected={selectedClaims?.some(c => c.id === claim.id)}
              onChange={() => handleClaimChange(claim)}
            >
              {claim.description}
            </Checkbox>
          ))}
        </Flex>
        <Flex direction="row" gap="size-100" justifyContent="end">
          <Button
            variant="secondary"
            onPress={() => window.close()}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            style="fill"
            onPress={async () => {
              const claimsContext: AdditionalContext<Claim> = {
                extensionId: extensionId,
                additionalContextType: AdditionalContextTypes.Claims,
                additionalContextValues: selectedClaims
              };
              await GenerationContextService.setAdditionalContext(guestConnection, claimsContext);
            }}
          >
            Select
          </Button>
        </Flex>
      </Flex>
      </View>
    </Provider>
  );
};