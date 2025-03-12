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

import { Experience, ExperienceService } from "@adobe/genstudio-uix-sdk";
import {
  Button,
  ComboBox,
  Divider,
  Flex,
  Heading,
  Item,
  Picker,
  ProgressCircle,
  Text,
  View,
} from "@adobe/react-spectrum";
import { attach } from "@adobe/uix-guest";
import React, { Key, useEffect, useState } from "react";

import { extensionId, TEST_CLAIMS } from "../Constants";
import { validateClaims } from "../utils/claimsValidation";
import ClaimsChecker from "./ClaimsChecker";

export default function RightPanel(): JSX.Element {
  const [guestConnection, setGuestConnection] = useState<any>(null);
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [selectedClaimLibrary, setSelectedClaimLibrary] = useState<Key>();
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
    number | null
  >(null);
  const [claimsResult, setClaimsResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const getExperience = async (): Promise<boolean> => {
    if (!guestConnection) return false;
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const remoteExperiences =
        await ExperienceService.getExperiences(guestConnection);
      if (remoteExperiences && remoteExperiences.length > 0) {
        setExperiences(remoteExperiences);
        return true;
      }
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const runClaimsCheck = async (
    experience: Experience,
    selectedExperienceIndex: number,
    selectedClaimLibrary: any,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const result = validateClaims(
        experience,
        selectedExperienceIndex,
        selectedClaimLibrary,
      );
      // Add a minimum loading time of 0.5 seconds
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update state with results
      setClaimsResult(result);
    } catch (error) {
      console.error("Error in claims validation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pollForExperiences = async () => {
    setIsPolling(true);
    let retries = 0;
    const maxRetries = 10;
    const interval = 2000; // 2 seconds

    while (retries < maxRetries) {
      const hasExperiences = await getExperience();
      if (hasExperiences) {
        setIsPolling(false);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
      retries++;
    }
    setIsPolling(false);
  };

  useEffect(() => {
    if (guestConnection) {
      pollForExperiences();
    }
  }, [guestConnection]);

  return (
    <View backgroundColor="static-white" height="100vh">
      {experiences && experiences.length > 0 ? (
        <Flex
          direction="column"
          height="100%"
          gap="size-200"
        >
          <View paddingX="size-200" paddingY="size-100">
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="size-100"
            >
              <Heading level={4}>Experiences</Heading>
              <Button
                variant="secondary"
                onPress={getExperience}
                UNSAFE_style={{ minWidth: "auto" }}
                isDisabled={isSyncing}
              >
                {isSyncing && (
                  <ProgressCircle
                    aria-label="Syncing"
                    isIndeterminate
                    size="S"
                    marginBottom="size-50"
                  />
                )}
                Sync
              </Button>
            </Flex>
            <Divider size="S" />
            <View marginTop="size-200">
              <Heading level={4}>Claim Libraries</Heading>
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
            <Divider size="S" />
            <ComboBox
              label="Select Experience to Run Claims Check"
              align="start"
              isDisabled={!selectedClaimLibrary}
              onSelectionChange={(key: React.Key | null) => {
                if (key !== null) {
                  const index = experiences.findIndex(exp => exp.id === key);
                  if (index !== -1) {
                    setSelectedExperienceIndex(index);
                  }
                }
              }}
            >
              {experiences.map((experience, index) => (
                <Item key={experience.id}>{`Experience ${index + 1}`}</Item>
              ))}
            </ComboBox>
          </View>
          {selectedExperienceIndex !== null && (
            <View paddingX="size-200">
              <Button
                variant="primary"
                width="100%"
                onPress={() => {
                  const experience = experiences[selectedExperienceIndex];
                  runClaimsCheck(
                    experience,
                    selectedExperienceIndex,
                    selectedClaimLibrary,
                  );
                }}
              >
                Run Claims Check
              </Button>
            </View>
          )}
          {isLoading ? (
            <Flex
              height="100%"
              marginBottom="size-200"
              alignItems="center"
              justifyContent="center"
            >
              <ProgressCircle aria-label="Loading" isIndeterminate />
            </Flex>
          ) : (
            claimsResult && (
              <View>
                <Divider size="S" />
                <View paddingX="size-200" paddingTop="size-200">
                  <Heading level={4}>Claims Results</Heading>
                </View>
                <ClaimsChecker
                  claims={claimsResult}
                  experienceNumber={selectedExperienceIndex || 0}
                />
              </View>
            )
          )}
        </Flex>
      ) : (
        <Flex
          direction="column"
          height="100%"
          alignItems="center"
          justifyContent="center"
          gap="size-200"
        >
          <ProgressCircle aria-label="Loading" isIndeterminate />
          {isPolling && <Text>Waiting for experiences to be ready...</Text>}
        </Flex>
      )}
    </View>
  );
}
