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

import { register } from "@adobe/uix-guest";
import { extensionId, ICON_DATA_URI, extensionLabel } from "./Constants";
import { AppMetaData, ExtensionRegistrationService } from "@adobe/genstudio-uix-sdk"
import React from 'react';

const getAppMetadata = (appExtensionId: string): AppMetaData => ({
  id: appExtensionId,
  label: extensionLabel,
  iconDataUri: ICON_DATA_URI,
  supportedChannels: [{
    id: "email",
    name: "Email",
  }],
  extensionId: 'deprecated'
});

const ExtensionRegistration = (): void => {
  const init = async (): Promise<void> => {
    const guestConnection = await register({
      id: extensionId,
      methods: {
        translation: {
          getAppMetadata: async (appExtensionId: string): Promise<AppMetaData> => {
            return getAppMetadata(appExtensionId);
          },
          getSupportedLocales: async (): Promise<string[]> => {
            return ["en", "fr", "de", "it", "es", "pt", "ru", "zh"];
          },
          getTranslation: async (locale: string, text: string): Promise<string> => {
            return `Translating ${text} to ${locale}`;
          }
        }
      }
    });
  };

  init().catch(console.error);
};

export default ExtensionRegistration;
