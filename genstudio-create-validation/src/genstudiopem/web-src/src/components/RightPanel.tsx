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

import React, { useEffect, useState } from 'react';
import { attach } from "@adobe/uix-guest";
import { extensionId } from "../Constants";
import { View, Provider, defaultTheme, Button, ComboBox, Item, Heading, Text, Flex, Divider } from '@adobe/react-spectrum';
import { Experience, ExperienceService } from '@adobe/genstudio-uix-sdk';

export default function RightPanel(): JSX.Element {
  const [guestConnection, setGuestConnection] = useState<any>(null);
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  useEffect(() => {
    (async () => {
      const connection = await attach({ id: extensionId });
      setGuestConnection(connection as any);
    })();
  }, []);

  const getExperience = async (): Promise<void> => {
    if (!guestConnection) return;
    const remoteExperiences = await ExperienceService.getExperiences(guestConnection);
    setExperiences(remoteExperiences);
  };

  const renderExperienceDetails = (experience: Experience) => (
    <Flex direction="column" gap="size-200">
      <Heading level={3}>Experience Details</Heading>
      <Flex direction="column" gap="size-100">
        <Text>ID: {experience.id}</Text>
        <Divider size="S" />
        <Heading level={4}>Fields</Heading>
        {Object.entries(experience.experienceFields).map(([key, field]) => (
          <Flex direction="column" gap="size-50" key={key}>
            <Text><strong>{field.fieldName}</strong></Text>
            <Text>{field.fieldValue}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );

  return (
    <Provider theme={defaultTheme}>
      <View backgroundColor="static-white" height="100vh">
        <Flex direction="column" height="100%">
          {experiences && experiences.length > 0 ? (
            <Flex direction="column" gap="size-200">
              <View paddingX="size-200" paddingY="size-100">
                <ComboBox 
                  label="Select Experience to Run Claims Check" 
                  align="start"
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
                      setSelectedExperience(experience);
                    }}
                  >
                    Run Claims Check
                  </Button>
                </View>
              )}

              {selectedExperience && (
                <View 
                  padding="size-200" 
                  overflow="auto hidden"
                  flex="1"
                  maxHeight="calc(100vh - 200px)"
                >
                  <Flex direction="column" width="100%">
                    {renderExperienceDetails(selectedExperience)}
                  </Flex>
                </View>
              )}
            </Flex>
          ) : (
            <View padding="size-200">
              <Button 
                variant="primary"
                width="100%"
                onPress={getExperience}
              >
                Get Experiences
              </Button>
            </View>
          )}
        </Flex>
      </View>
    </Provider>
  );
}