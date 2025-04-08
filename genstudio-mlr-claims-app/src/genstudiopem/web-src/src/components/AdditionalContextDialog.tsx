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

import {
  AdditionalContext,
  AdditionalContextTypes,
  Claim,
  ExtensionRegistrationService,
  GenerationContextService,
} from "@adobe/genstudio-uix-sdk";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Grid,
  View,
} from "@adobe/react-spectrum";
import React, { useEffect, useState } from "react";

import { extensionId, TEST_CLAIMS } from "../Constants";
import { useGuestConnection, useSelectedClaimLibrary } from "../hooks";
import { ClaimsLibraryPicker } from "./ClaimsLibraryPicker";

export default function AdditionalContextDialog(): JSX.Element {
  const [filteredClaimsList, setFilteredClaimsList] = useState<Claim[]>([]);
  const [selectedClaims, setSelectedClaims] = useState<Claim[]>([]);

  const guestConnection = useGuestConnection(extensionId);
  const { selectedClaimLibrary, handleClaimsLibrarySelection } =
    useSelectedClaimLibrary();

  useEffect(() => {
    const libraryClaims =
      TEST_CLAIMS.find((library) => library.id === selectedClaimLibrary)
        ?.claims || [];
    setFilteredClaimsList(libraryClaims);
  }, [selectedClaimLibrary]);

  const handleClaimChange = (claim: Claim) => {
    setSelectedClaims((prev) =>
      prev.some((c) => c.id === claim.id)
        ? prev.filter((c) => c.id !== claim.id)
        : [...prev, claim]
    );
  };

  const handleCancel = () =>
    ExtensionRegistrationService.closeAddContextAddOnBar(guestConnection);

  const handleClaimSelect = async () => {
    const claimsContext: AdditionalContext<Claim> = {
      extensionId: extensionId,
      additionalContextType: AdditionalContextTypes.Claims,
      additionalContextValues: selectedClaims,
    };
    await GenerationContextService.setAdditionalContext(
      guestConnection,
      claimsContext
    );
  };

  return (
    <View backgroundColor="static-white" height="100vh">
      <Grid
        columns={["1fr"]}
        rows={["auto", "1fr", "auto"]}
        areas={["library", "claims", "actions"]}
        height="100%"
        marginX="size-200"
        gap="size-300"
      >
        <View gridArea="library" marginTop="size-150">
          <ClaimsLibraryPicker
            handleSelectionChange={handleClaimsLibrarySelection}
          />
        </View>
        <View gridArea="claims" overflow="auto">
          <Flex direction="column" gap="size-100">
            {filteredClaimsList.map((claim) => (
              <Checkbox
                key={claim.id}
                marginStart="size-50"
                isSelected={selectedClaims?.some((c) => c.id === claim.id)}
                onChange={() => handleClaimChange(claim)}
              >
                {claim.description}
              </Checkbox>
            ))}
          </Flex>
        </View>
        <ButtonGroup gridArea="actions" align="end">
          <Button variant="secondary" onPress={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" style="fill" onPress={handleClaimSelect}>
            Ok
          </Button>
        </ButtonGroup>
      </Grid>
    </View>
  );
}
