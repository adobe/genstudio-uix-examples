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
import { Provider, defaultTheme, Flex, Item, Divider, SearchField, Checkbox, Key, Button, Picker, View, Grid } from '@adobe/react-spectrum';
import { Claim, AdditionalContextTypes, GenerationContextService, AdditionalContext, ExtensionRegistrationService } from '@adobe/genstudio-uix-sdk';

export default function AdditionalContextDialog(): JSX.Element {
  const [guestConnection, setGuestConnection] = useState<any>(null);
  const [selectedClaimLibrary, setSelectedClaimLibrary] = useState<Key>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [claimsList, setClaimsList] = useState<Claim[]>([]);
  const [filteredClaimsList, setFilteredClaimsList] = useState<Claim[]>([]);
  const [selectedClaims, setSelectedClaims] = useState<Claim[]>([]);
  const [disableSearch, setDisableSearch] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const connection = await attach({ id: extensionId });
      setGuestConnection(connection as any);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (guestConnection) {
        const generationContext = await GenerationContextService.getGenerationContext(guestConnection);
        if (generationContext?.additionalContexts) {
          const contextValues = Object.values(generationContext.additionalContexts).flat();
          const appClaims = contextValues.find(ctx => 
            ctx.extensionId === extensionId && 
            ctx.additionalContextType === AdditionalContextTypes.Claims
          );
          
          if (appClaims && Array.isArray(appClaims.additionalContextValues)) {
            setSelectedClaims(appClaims.additionalContextValues);
          }
        }
      }
    })();
  }, [guestConnection]);

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
    setDisableSearch(!selectedClaimLibrary);
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
        <Grid
          areas={[
            'library',
            'divider',
            'search',
            'claims',
            'actions'
          ]}
          columns={['1fr']}
          rows={['auto', 'auto', 'auto', '2fr', 'auto']}
          height="100%"
          gap="size-300"
        >
          <View gridArea="library">
            <Picker
              label="Select a claim library"
              width="100%"
              onSelectionChange={handleClaimsLibrarySelection}
            >
              {TEST_CLAIMS.map(library => (
                <Item key={library.id}>{library.name}</Item>
              ))}
            </Picker>
          </View>
          
          <View gridArea="divider">
            <Divider size="S" />
          </View>
          
          <View gridArea="search">
            <SearchField
              label="Search Claims"
              width="100%"
              value={searchTerm}
              onChange={handleSearchChange}
              isDisabled={disableSearch}
            />
          </View>
          
          <View gridArea="claims" overflow="auto">
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
          </View>
          
          <Flex direction="row" gap="size-100" justifyContent="end" gridArea="actions">
            <Button
              variant="secondary"
              onPress={() => ExtensionRegistrationService.closeAddContextAddOnBar(guestConnection)}
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
        </Grid>
      </View>
    </Provider>
  );
};