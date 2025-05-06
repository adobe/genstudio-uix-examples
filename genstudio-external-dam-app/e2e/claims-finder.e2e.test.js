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

const fetch = require("node-fetch");
const { Core } = require("@adobe/aio-sdk");
const pkg = require("../package.json");

describe("E2E claims-finder", () => {
  let actionUrl;

  beforeAll(() => {
    const namespace = Core.Config.get("runtime.namespace");
    const hostname = Core.Config.get("cna.hostname") || "adobeioruntime.net";
    actionUrl = `https://${namespace}.${hostname}/api/v1/web/${pkg.name}/claims-finder`;
  });

  // The deployed actions are secured with the `require-adobe-auth` annotation.
  // If the authorization header is missing, Adobe I/O Runtime returns with a 401 before the action is executed.
  it("should return 401 when Authorization header is missing", async () => {
    const res = await fetch(actionUrl);
    expect(res.status).toBe(401);
  });
});
