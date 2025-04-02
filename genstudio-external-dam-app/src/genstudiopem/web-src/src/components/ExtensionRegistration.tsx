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

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId, ICON_DATA_URI, extensionLabel } from "../Constants";
import { AppMetaData, ExtensionRegistrationService } from "@adobe/genstudio-uix-sdk"
import React from 'react';

interface ToggleItem {
  appMetaData: AppMetaData;
  onClick: () => Promise<void>;
}

interface PanelItem {
  id: string;
  url: string;
  extensionId: string;
}

interface DialogItem {
  id: string;
  url: string;
  extensionId: string;
  appMetaData: AppMetaData;
}


const getAppMetadata = (appExtensionId: string): AppMetaData => ({
  id: extensionId,
  label: extensionLabel,
  iconDataUri: ICON_DATA_URI,
  supportedChannels: [{
    id: "email",
    name: "Email",
  }],
  extensionId: appExtensionId,
  // accounts: [
  //   {
  //     id: '12373425',
  //     name: 'test account'
  //   }
  // ]
});

const ExtensionRegistration = (): React.JSX.Element => {
  const init = async (): Promise<void> => {
    const guestConnection = await register({
      id: extensionId,
      methods: {
        // todo: remove createAddOnBar and createRightPanel
        createAddOnBar: {
          addToggle: async (appExtensionId: string): Promise<ToggleItem[]> => {
            return [
              {
                appMetaData: getAppMetadata(appExtensionId),
                onClick: async () => {
                  await ExtensionRegistrationService.openCreateAddOnBar(guestConnection, appExtensionId);
                },
              }]
          }
        },
        createRightPanel: {
          addPanel(appExtensionId: string): PanelItem[] {
            return [
              {
                id: `${appExtensionId}`,
                url: '#/right-panel',
                extensionId: appExtensionId
              }];
          }
        },
        createSelectContentDialog: {
          selectDialog(appExtensionId: string): DialogItem[] {
            return [
              {
                id: `${appExtensionId}`,
                url: '#/select-content-dialog',
                extensionId: appExtensionId,
                appMetaData: getAppMetadata(appExtensionId)
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