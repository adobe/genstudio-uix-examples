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

/**
 * Invokes a web action
 * @param {string} actionUrl - The URL of the web action to invoke
 * @param {string} imsToken - The IMS token for authentication
 * @param {string} imsOrg - The IMS organization ID
 * @param {object} params - Parameters to pass to the web action
 * @returns {Promise<object>} The response from the web action
 */
export const actionWebInvoke = async (
  actionUrl: string,
  imsToken: string,
  imsOrg: string,
  params: Record<string, any> = {}
): Promise<any> => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${imsToken}`,
    "x-gw-ims-org-id": imsOrg,
  };

  // Ensure params is an object
  const requestParams = params || {};

  try {
    const response = await fetch(actionUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Error invoking action:", error);
    throw error;
  }
};
