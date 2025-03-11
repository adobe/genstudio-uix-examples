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

import React, { Key, useEffect, useState } from 'react';
import { attach } from "@adobe/uix-guest";
import { extensionId, TEST_CLAIMS } from "../Constants";
import { View, Provider, defaultTheme, Button, ComboBox, Item, Flex, Divider, Picker, Text, Heading, ProgressCircle } from '@adobe/react-spectrum';
import { Experience, ExperienceService } from '@adobe/genstudio-uix-sdk';
import { validateClaims } from '../utils/claimsValidation';
import ClaimsChecker from './ClaimsChecker';
import Spinner from './Spinner';

export default function RightPanel(): JSX.Element {
  const [guestConnection, setGuestConnection] = useState<any>(null);
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [selectedClaimLibrary, setSelectedClaimLibrary] = useState<Key>();
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number | null>(null);
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

  const getExperience = async (): Promise<Experience[] | null> => {
    if (!guestConnection) return null;
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const remoteExperiences = await ExperienceService.getExperiences(guestConnection);
      if (remoteExperiences && remoteExperiences.length > 0) {
        setExperiences(remoteExperiences);
        return remoteExperiences;
      }
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRunClaimsCheck = async (): Promise<void> => {
    if (selectedExperienceIndex == null || !selectedClaimLibrary) return;
    setIsLoading(true);
    try {
      const newExperiences = await getExperience(); // setState is async
      if (!newExperiences) return;
      const experience = newExperiences[selectedExperienceIndex];
      const result = validateClaims(experience, selectedClaimLibrary);
      // Add a minimum loading time of 0.5 seconds
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update state with results
      setClaimsResult(result);
    } catch (error) {
        console.error('Error in claims validation:', error);
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
    <Provider theme={defaultTheme}>
      <View backgroundColor="static-white" height="100vh">
    
        <Flex direction="column" height="100%">
          {experiences && experiences.length > 0 ? (
            <Flex direction="column" gap="size-200">
              <View paddingX="size-200" paddingY="size-100">
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
                  label="Select an experience to run claims check" 
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

              <View paddingX="size-200">
                <Button 
                  variant="primary"
                  width="100%"
                  onPress={handleRunClaimsCheck}
                  isDisabled={selectedExperienceIndex == null || !selectedClaimLibrary || !experiences}
                >
                  Run Claims Check
                </Button>
              </View>
              
              {isLoading ? (
                <View padding="size-200">
                  <Spinner />
                </View>
              ) : claimsResult && (
                <View>
                  <Divider size="S" />
                  <View paddingX="size-200" paddingTop="size-200">
                    <Heading level={4}>Claims Results</Heading>
                  </View>
                  <ClaimsChecker claims={claimsResult} experienceNumber={selectedExperienceIndex || 0} />
                </View>
              )}

            </Flex>

          ) : (
            // In case app is loaded before experiences are loaded
            <View padding="size-200">
              <Flex direction="column" gap="size-100" alignItems="center">
                <Spinner />
                {isPolling && (
                  <Text>Waiting for experiences to be ready...</Text>
                )}
              </Flex>
            </View>
          )}
        </Flex> 
      </View>
    </Provider>
  );
}