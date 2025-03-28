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

/* global fetch */
/**
 *
 * Invokes a web action
 *
 * @param  {string} actionUrl
 * @param {object} headers
 * @param  {object} params
 *
 * @returns {Promise<string|object>} the response
 *
 */

async function actionWebInvoke (actionUrl: string, headers: Record<string, string> = {}, params: Record<string, any> = {}, options: { method: string } = { method: 'POST' }) {  
  const actionHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  }

  const fetchConfig: RequestInit = {
    headers: actionHeaders
  }

  if (window.location.hostname === 'localhost') {
    actionHeaders['x-ow-extra-logging'] = 'on'
  }

  fetchConfig.method = options.method.toUpperCase()

  if (fetchConfig.method === 'GET') {
    const url = new URL(actionUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    actionUrl = url.toString();
  } else if (fetchConfig.method === 'POST') {
    fetchConfig.body = JSON.stringify(params)
  }
  
  const response = await fetch(actionUrl, fetchConfig)

  let content = await response.text()
  
  if (!response.ok) {
    return JSON.parse(content)
  }
  try {
    content = JSON.parse(content)
  } catch (e) {
    // response is not json
  }
  return content
}

export default actionWebInvoke