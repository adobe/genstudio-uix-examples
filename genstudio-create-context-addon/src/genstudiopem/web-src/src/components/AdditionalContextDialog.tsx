import React, { useEffect, useState } from 'react';
import { attach } from "@adobe/uix-guest";
import { extensionId } from "../Constants";
import { View, Provider, defaultTheme, Button, ComboBox, Item, Heading, Text } from '@adobe/react-spectrum';

interface Experience {
  // Add specific experience properties here
  [key: string]: any;
}

export default function AdditionalContextDialog(): JSX.Element {
  const [guestConnection, setGuestConnection] = useState<any>(null);
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number | null>(null);
  const [claimsCheckResults, setClaimsCheckResults] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const connection = await attach({ id: extensionId });
      setGuestConnection(connection as any);
    })();
  }, []);  

  const getExperience = async (): Promise<void> => {
    if (!guestConnection) return;
    const remoteExperiences = await guestConnection.host.api.createRightPanel.getExperiences();
    console.log(remoteExperiences);
    setExperiences(remoteExperiences);
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
                const index = typeof key === 'number' ? key : 0;
                console.log(`index${index}`); 
                setSelectedExperienceIndex(index); 
                setClaimsCheckResults(null); 
              }}
            >
              {experiences.map((experience, index) => (
                <Item key={`experience-${experience.id || index}`}>{`Experience ${index + 1}`}</Item>
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
              onPress={() => setClaimsCheckResults(JSON.stringify(experiences[selectedExperienceIndex], null, 2))}
            >
              Run Claims Check
            </Button>
          </View>
        )}
        <View UNSAFE_style={{ flex: 1, overflow: 'auto' }}>
          {selectedExperienceIndex !== null && (
            <View>
              <Heading level={3}>Claim Check Results Experience</Heading>
              <pre>{claimsCheckResults}</pre>
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