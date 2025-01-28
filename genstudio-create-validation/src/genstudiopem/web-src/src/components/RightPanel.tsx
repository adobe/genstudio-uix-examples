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

  const renderExperienceDetails = (experience: Experience) => {
    return (
      <Flex direction="column" gap="size-200">
        <Heading level={3}>Experience Details</Heading>
        <Flex direction="column" gap="size-100">
          <Text>ID: {experience.id}</Text>
          <Divider />
          <Heading level={4}>Fields</Heading>
          {Object.entries(experience.experienceFields).map(([key, field]) => (
            <Flex direction="column" gap="size-50" key={key}>
              <Text UNSAFE_style={{ fontWeight: 'bold' }}>{field.fieldName}</Text>
              <Text>{field.fieldValue}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  };

  return (
    <Provider theme={defaultTheme}>
      <View UNSAFE_style={{ display: 'flex', flexDirection: 'column' }} backgroundColor="static-white">
      {experiences && experiences.length > 0 ? (
        <>
        <View UNSAFE_style={{ flex: 1, overflow: 'auto' }}>
          {experiences && experiences.length > 0 ? (
            <ComboBox 
              label="Select Experience to Run Claims Check" 
              align="start" 
              width="auto" 
              onSelectionChange={(key) => { 
                const index = experiences.findIndex(exp => exp.id === key);
                if (index !== -1) {
                  setSelectedExperienceIndex(index);
                }
              }}
            >
              {experiences.map((experience, index) => (
                <Item key={experience.id}>{`Experience ${index + 1}`}</Item>
              ))}
            </ComboBox>
          ) : (
            <Text>There are no experiences to display</Text>
          )}
        </View>
        {selectedExperienceIndex !== null && (
          <View UNSAFE_style={{ flexShrink: 0 }} marginTop="size-200">
            <Button 
              variant="primary" 
              staticColor="black" 
              style="fill" 
              UNSAFE_style={{ width: '100%' }}
              onPress={() => {
                const experience = experiences[selectedExperienceIndex];
                console.log('Selected Experience:', experience);
                setSelectedExperience(experience);
              }}
            >
              Run Claims Check
            </Button>
          </View>
        )}
        <View UNSAFE_style={{ flex: 1, overflow: 'auto' }}>
          {selectedExperience !== null && (
            <View padding="size-200">
              {renderExperienceDetails(selectedExperience)}
            </View>
          )}
        </View>
        </>
      ) : (
        <View UNSAFE_style={{ flexShrink: 0 }}>
          <Button 
            variant="primary" 
            staticColor="black"
            style="fill" 
            UNSAFE_style={{ width: '100%' }}
            onPress={getExperience}
          >
            Get Experiences
          </Button>
        </View>
      )}
      </View>
    </Provider>
  );
}