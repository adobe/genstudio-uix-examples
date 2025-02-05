import React, { useEffect, useState } from 'react';
import { attach } from "@adobe/uix-guest";
import { extensionId } from "../Constants";
import { View, Provider, defaultTheme, Button, ComboBox, Item, Heading, Text, Flex } from '@adobe/react-spectrum';
import { AdditionalContext, AdditionalContextTypes, Claim } from '@adobe/genstudio-uix-sdk';

interface Experience {
  // Add specific experience properties here
  [key: string]: any;
}

export default function AdditionalContextDialog(): JSX.Element {
  const [guestConnection, setGuestConnection] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const connection = await attach({ id: extensionId });
      setGuestConnection(connection as any);
    })();
  }, []);

  const addToAdditionalContext = async () => {
    const additionalContextValues: Claim[] = [
      {
        id: "claim1",
        description: "Claim 1",
      },
      {
        id: "claim2",
        description: "Claim 2",
      },
    ];
    console.log("Guest app", AdditionalContextTypes.Claims, additionalContextValues);
    await guestConnection.host.api.create.updateCustomPrompt(AdditionalContextTypes.Claims, additionalContextValues);
  };

  return (
    <Provider theme={defaultTheme}>
      <View>
        <Heading level={1}>Additional Context</Heading>
        <Flex direction="column" gap="size-100">
          <Text>Provide additional context to the user experience.</Text>
          <Button variant="cta" onPress={addToAdditionalContext}>Add Context</Button>
        </Flex>
      </View>
    </Provider>
  );
};
