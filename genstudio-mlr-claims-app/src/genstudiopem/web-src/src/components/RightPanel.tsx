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
import {
  getSelectedExperienceId,
  setSelectedExperienceId,
  SELECTED_EXPERIENCE_ID_STORAGE_KEY,
} from "../utils/experienceBridge";

export default function RightPanel(): JSX.Element {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
    number | null
  >(null);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(
    null
  );
  const [claimsResults, setClaimsResults] = useState<ClaimResults[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const guestConnection = useGuestConnection(extensionId);

  useEffect(() => {
    if (guestConnection) pollForExperiences();
  }, [guestConnection]);

  // Check if we need a more explicit claims check trigger
  useEffect(() => {
    if (selectedExperienceIndex !== null) handleRunClaimsCheck();
  }, [selectedExperienceIndex]);

  // if experiences are loaded or changed, set the selected experience index
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SELECTED_EXPERIENCE_ID_STORAGE_KEY && event.newValue) {
        const index = getExperienceIndex(event.newValue);
        setSelectedExperienceIndex(index);
      }
    };
    const selectedExperienceId = getSelectedExperienceId();
    if (selectedExperienceId && experiences?.length) {
      const index = getExperienceIndex(selectedExperienceId);
      setSelectedExperienceIndex(index);
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [experiences]);

  const handleRunClaimsCheck = async () => {
    if (selectedExperienceIndex === null) return;
    // setState is async so we need the result from getExperience directly
    const newExperiences = await syncExperiences();
    if (!newExperiences?.length) return;
    runClaimsCheck(newExperiences);
  };

  const getExperienceIndex = (experienceId: string): number => {
    if (!experiences?.length) return 0;
    const index = experiences.findIndex((exp) => exp.id === experienceId);
    return index !== -1 ? index : 0;
  };

  const syncExperiences = async (): Promise<Experience[] | null> => {
    if (!guestConnection) return null;

    setIsSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const remoteExperiences = await ExperienceService.getExperiences(
        guestConnection
      );
      if (remoteExperiences && remoteExperiences.length > 0) {
        setExperiences(remoteExperiences);
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
      const hasExperiences = await syncExperiences();
      if (hasExperiences) {
        setIsPolling(false);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      retries++;
    }
    setIsPolling(false);
  };

  // (Optional) If handleSelectedExperienceChange is provided in ExtensionRegistration
  //            host app will render a experience selector at the top of the right panel
  //            Note that this does not control the create canvas and so selection is not sync back to the host app
  // const handleExperienceSelection = (key: Key | null) => {
  //   if (!key) return;
  //   setSelectedExperienceId(key as string);
  //   // This is called because storage event is not designed to fired on same tab
  //   setSelectedExperienceIndex(getExperienceIndex(key as string));
  // };
  // const renderExperiencePicker = () => {
  //   if (!experiences) return null;
  //   return (
  //     <Picker
  //       label="Select experience"
  //       align="start"
  //       isDisabled={isSyncing}
  //       selectedKey={experiences[selectedExperienceIndex ?? 0].id}
  //       onSelectionChange={handleExperienceSelection}
  //     >
  //       {experiences.map((experience, index) => (
  //         <Item key={experience.id}>{`Experience ${index + 1}`}</Item>
  //       ))}
  //     </Picker>
  //   );
  // };

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
          {/* (Optional) If handleSelectedExperienceChange is provided in ExtensionRegistration
                         host app will render a experience selector at the top of the right panel
          {renderExperiencePicker()} */}
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
