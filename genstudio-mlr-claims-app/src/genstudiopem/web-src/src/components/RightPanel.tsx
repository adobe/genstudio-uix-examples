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
import React, { useEffect, useState, type Key } from "react";

import { extensionId, TEST_CLAIMS } from "../Constants";
import { useGuestConnection } from "../hooks";
import { ClaimResults } from "../types";
import { validateClaims } from "../utils/claimsValidation";
import ClaimsChecker from "./ClaimsChecker";

export default function RightPanel(): JSX.Element {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
    number | null
  >(null);
  const [claimsResults, setClaimsResults] = useState<ClaimResults[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const guestConnection = useGuestConnection(extensionId);

  useEffect(() => {
    if (guestConnection) {
      pollForExperiences();
    }
  }, [guestConnection]);

  useEffect(() => {
    handleRunClaimsCheck();
  }, [selectedExperienceIndex]);

  const handleExperienceSelection = (key: Key | null) => {
    if (!key || !experiences?.length) return;

    const index = experiences.findIndex((exp) => exp.id === key);
    if (index !== -1) {
      setSelectedExperienceIndex(index);
    }
  };

  const handleRunClaimsCheck = async () => {
    if (selectedExperienceIndex === null) return;
    // setState is async so we need the result from getExperience directly
    const newExperiences = await getExperience();
    if (!newExperiences?.length) return;
    runClaimsCheck(newExperiences);
  };

  const getExperience = async (): Promise<Experience[] | null> => {
    if (!guestConnection) return null;

    setIsSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const remoteExperiences = await ExperienceService.getExperiences(
        guestConnection
      );
      if (remoteExperiences && remoteExperiences.length > 0) {
        setExperiences(remoteExperiences);
        setSelectedExperienceIndex(selectedExperienceIndex ?? 0);
        return remoteExperiences;
      }
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  const runClaimsCheck = async (experiences: Experience[]): Promise<void> => {
    setIsLoading(true);
    try {
      // run all claim libraries
      const allClaimLibraries = TEST_CLAIMS.map((library) => library.id);
      const results: ClaimResults[] = [];
      for (let experience of experiences) {
        const result = validateClaims(experience, allClaimLibraries);
        results.push(result);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      setClaimsResults(results);
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
        isDisabled={isSyncing}
        onSelectionChange={handleExperienceSelection}
        defaultSelectedKey={
          experiences?.length > 0 ? experiences[0].id : undefined
        }
      >
        {experiences.map((experience, index) => (
          <Item key={experience.id}>{`Experience ${index + 1}`}</Item>
        ))}
      </Picker>
    );
  };

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
    if (!claimsResults) return null;

    return (
      <ClaimsChecker
        claims={claimsResults}
        experienceNumber={selectedExperienceIndex ?? 0}
      />
    );
  };

  const renderClaimsChecker = () => (
    <Flex height="100%" direction="column" marginY="size-200" gap="size-400">
      <Flex direction="column" gap="size-200">
        <Heading level={2} marginY="size-0">
          Check Claims
        </Heading>
        <Flex direction="column" gap="size-300">
          {renderExperiencePicker()}
          {renderRunClaimsCheckButton()}
        </Flex>
      </Flex>
      {(isLoading || claimsResults) && <Divider size="S" />}
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
