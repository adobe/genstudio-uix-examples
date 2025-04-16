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
import { AppMetadata } from "@adobe/genstudio-uix-sdk";
import React, { Key } from "react";

interface Toggle {
  metadata: AppMetadata;
  onClick: () => Promise<void>;
}

interface App {
  id: Key;
  url: string;
  metadata: AppMetadata;
}

const getAppMetadata = (id: Key): AppMetadata => ({
  id: id.toString(),
  label: extensionLabel,
  iconDataUri: ICON_DATA_URI,
  supportedChannels: [
    {
      id: "email",
      name: "Email",
    },
  ],
  extensionId: "deprecated",
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
        contentSelectContentExtension: {
          getToggles: async (id: string): Promise<Toggle[]> => [
            {
              metadata: getAppMetadata(id),
              onClick: async () => {
                // const hostInfo = await guestConnection.host.api.contentSelectContentAddOns.openDialog(`${dialogId}`);
              },
            },
          ],
          getApps: (id: string): App[] => [
            {
              id: id,
              url: "#/select-content-dialog",
              metadata: getAppMetadata(id),
            },
          ],
        },
      },
    });
  };

  init().catch(console.error);

  return (
    <Text>
      IFrame for integration with Host (GenStudio for Performance Marketing
      App)...
    </Text>
  );
};

export default ExtensionRegistration;
