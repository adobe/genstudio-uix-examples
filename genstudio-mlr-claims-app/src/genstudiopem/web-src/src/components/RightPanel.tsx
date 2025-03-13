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

import { extensionId } from "../Constants";
import { validateClaims } from "../utils/claimsValidation";
import ClaimsChecker from "./ClaimsChecker";
import { ClaimsLibraryPicker } from "./ClaimsLibraryPicker";

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

  useEffect(() => {
    if (guestConnection) {
      pollForExperiences();
    }
  }, [guestConnection]);

  useEffect(() => {
    setClaimsResult(null);
  }, [selectedExperienceIndex]);

  console.log(claimsResult);

  const handleClaimsLibrarySelection = (library: Key | null) => {
    if (library === null) return;

    setSelectedClaimLibrary(library);
  };

  const handleExperienceSelection = (key: React.Key | null) => {
    if (!key || !experiences?.length) return;

    const index = experiences.findIndex((exp) => exp.id === key);
    if (index !== -1) {
      setSelectedExperienceIndex(index);
    }
  };

  const handleRunClaimsCheck = () => {
    if (selectedExperienceIndex === null || !experiences?.length) return;

    const experience = experiences[selectedExperienceIndex];
    runClaimsCheck(experience, selectedExperienceIndex, selectedClaimLibrary);
  };

  const getExperience = async (): Promise<boolean> => {
    if (!guestConnection) return false;

    setIsSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const remoteExperiences = await ExperienceService.getExperiences(
        guestConnection
      );
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
    selectedClaimLibrary: any
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const result = validateClaims(
        experience,
        selectedExperienceIndex,
        selectedClaimLibrary
      );
      // Add a minimum loading time of 0.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 500));
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
      await new Promise((resolve) => setTimeout(resolve, interval));
      retries++;
    }
    setIsPolling(false);
  };

  const renderExperiencePicker = () => {
    if (!experiences) return null;

    return (
      <Picker
        label="Select experience"
        align="start"
        isDisabled={!selectedClaimLibrary || isSyncing}
        onSelectionChange={handleExperienceSelection}
      >
        {experiences.map((experience, index) => (
          <Item key={experience.id}>{`Experience ${index + 1}`}</Item>
        ))}
      </Picker>
    );
  };

  const renderSyncExperiencesButton = () => (
    <Button
      variant="secondary"
      width="160px"
      isDisabled={isSyncing}
      onPress={getExperience}
      marginTop="size-300"
    >
      {isSyncing ? (
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          gap="size-50"
        >
          <ProgressCircle
            size="S"
            marginEnd="size-50"
            aria-label="Syncing"
            isIndeterminate
          />
          <Text>Syncing...</Text>
        </Flex>
      ) : (
        <Text>Sync Experiences</Text>
      )}
    </Button>
  );

  const renderRunClaimsCheckButton = () => {
    if (selectedExperienceIndex === null) return null;

    return (
      <Button
        variant="primary"
        isDisabled={isLoading}
        onPress={handleRunClaimsCheck}
      >
        Run Claims Check
      </Button>
    );
  };

  const renderLoadingIndicator = () => (
    <Flex height="100%" alignItems="center" justifyContent="center">
      <ProgressCircle aria-label="Loading" isIndeterminate />
    </Flex>
  );

  const renderResults = () => {
    if (!claimsResult) return null;

    return (
      <Flex direction="column" gap="size-300">
        <Heading level={3} UNSAFE_style={{ lineHeight: "0px" }}>
          Results
        </Heading>
        <ClaimsChecker
          claims={claimsResult}
          experienceNumber={selectedExperienceIndex || 0}
        />
      </Flex>
    );
  };

  const renderClaimsChecker = () => (
    <Flex height="100%" direction="column" marginY="size-200" gap="size-400">
      <Flex direction="column" gap="size-200">
        <Heading level={3} UNSAFE_style={{ lineHeight: "8px" }}>
          Check Claims
        </Heading>
        <Flex direction="column" gap="size-300">
          <ClaimsLibraryPicker handleSelectionChange={handleClaimsLibrarySelection} />
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {renderExperiencePicker()}
            {renderSyncExperiencesButton()}
          </Flex>
          {renderRunClaimsCheckButton()}
        </Flex>
      </Flex>
      {(isLoading || claimsResult) && <Divider size="S" />}
      {isLoading ? renderLoadingIndicator() : renderResults()}
    </Flex>
  );

  const renderWaitingForExperiences = () => (
    <Flex
      height="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap="size-200"
    >
      <ProgressCircle aria-label="Loading" isIndeterminate />
      {isPolling && <Text>Waiting for experiences to be ready...</Text>}
    </Flex>
  );

  return (
    <View backgroundColor="static-white" height="100vh">
      <Flex height="100%" direction="column" marginX="size-200">
        {experiences && experiences.length > 0
          ? renderClaimsChecker()
          : renderWaitingForExperiences()}
      </Flex>
    </View>
  );
}
