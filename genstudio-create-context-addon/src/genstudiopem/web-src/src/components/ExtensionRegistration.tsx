/*
 * <license header>
 */

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId, ICON_DATA_URI, extensionLabel } from "../Constants";
import { AppMetaData } from "@adobe/genstudio-uix-sdk"
import React from 'react';

interface ToggleItem {
  appMetaData: AppMetaData;
  onClick: () => Promise<void>;
}

interface DialogItem {
  id: string;
  url: string;
  extensionId: string;
}

const getAppMetadata = (appExtensionId: string): AppMetaData => ({
  id: extensionId,
  label: extensionLabel,
  iconDataUri: ICON_DATA_URI,
  supportedChannels: [{
    id: "email",
    name: "Email",
  }],
  extensionId: appExtensionId
});

const ExtensionRegistration = (): React.JSX.Element => {
  const init = async (): Promise<void> => {
    const guestConnection = await register({
      id: extensionId,
      methods: {
        createContextAddOns: {
          addContextAddOn: async (appExtensionId: string): Promise<ToggleItem[]> => {
            return [
              {
                appMetaData: getAppMetadata(appExtensionId),
                onClick: async () => {
                  // @ts-ignore - RPC Post Message between IFrames
                  await guestConnection.host.api.dialogs.open(`${appExtensionId}`);
                },
              }]
          }
        },
        createCanvasDialog: {
          addDialog(appExtensionId: string): DialogItem[] {
            return [
              {
                id: `${appExtensionId}`,
                url: '#/additional-context-dialog',
                extensionId: appExtensionId
              }];
          }
        },
      }
    });
  };
  
  init().catch(console.error);

  return <Text>IFrame for integration with Host (GenStudio for Performance Marketing App)...</Text>;
};

export default ExtensionRegistration;
