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

const { Core } = require("@adobe/aio-sdk");
const S3DamProvider = require("../src/genstudiopem/actions/claims-finder/provider/s3/S3DamProvider");
const { main } = require("../src/genstudiopem/actions/claims-finder/index.js");

jest.mock("@adobe/aio-sdk", () => ({
  Core: { Logger: jest.fn(), Config: { get: jest.fn() } },
}));
jest.mock(
  "../src/genstudiopem/actions/claims-finder/provider/s3/S3DamProvider"
);

describe("claims-finder action", () => {
  const goodParams = { __ow_headers: { authorization: "Bearer faketoken" } };
  let logger, fakeProvider;

  beforeEach(() => {
    jest.clearAllMocks();

    logger = { info: jest.fn(), debug: jest.fn(), error: jest.fn() };
    Core.Logger.mockReturnValue(logger);

    fakeProvider = {
      searchAssets: jest
        .fn()
        .mockResolvedValue({ statusCode: 200, body: { assets: [] } }),
      getAssetUrl: jest
        .fn()
        .mockResolvedValue({ statusCode: 200, body: { url: "url" } }),
      getAssetMetadata: jest
        .fn()
        .mockResolvedValue({ statusCode: 200, body: { metadata: {} } }),
    };

    // eslint-disable-next-line no-unused-vars
    S3DamProvider.mockImplementation((_params, _passedLogger) => fakeProvider);
  });

  it("exports main as a function", () => {
    expect(typeof main).toBe("function");
  });

  it("initializes the logger with the provided LOG_LEVEL", async () => {
    await main({ ...goodParams, LOG_LEVEL: "verbose" });
    expect(Core.Logger).toHaveBeenCalledWith(expect.any(String), {
      level: "verbose",
    });
  });

  it("constructs S3DamProvider with (params, logger)", async () => {
    await main(goodParams);
    expect(S3DamProvider).toHaveBeenCalledWith(goodParams, logger);
  });

  it("routes to searchAssets when actionType is search", async () => {
    await main({ ...goodParams, actionType: "search" });
    expect(fakeProvider.searchAssets).toHaveBeenCalledWith({
      ...goodParams,
      actionType: "search",
    });
  });

  it("routes to getUrl when actionType is getUrl", async () => {
    await main({ ...goodParams, actionType: "getUrl" });
    expect(fakeProvider.getAssetUrl).toHaveBeenCalledWith({
      ...goodParams,
      actionType: "getUrl",
    });
  });

  it("routes to getMetadata when actionType is getMetadata", async () => {
    await main({ ...goodParams, actionType: "getMetadata" });
    expect(fakeProvider.getAssetMetadata).toHaveBeenCalledWith({
      ...goodParams,
      actionType: "getMetadata",
    });
  });

  it("returns a 400 on unsupported actionType", async () => {
    const res = await main({ ...goodParams, actionType: "badAction" });
    expect(res).toEqual({
      error: {
        statusCode: 400,
        body: { error: "Unsupported action type: badAction" },
      },
    });
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("returns a 400 when Authorization header is missing for search", async () => {
    const res = await main({ actionType: "search" });
    expect(res).toEqual({
      error: {
        statusCode: 400,
        body: { error: "missing header(s) 'authorization'" },
      },
    });
  });

  it("returns a 400 when Authorization header is missing for getUrl", async () => {
    const res = await main({ actionType: "getUrl" });
    expect(res).toEqual({
      error: {
        statusCode: 400,
        body: { error: "missing header(s) 'authorization'" },
      },
    });
  });

  it("returns a 400 when Authorization header is missing for getMetadata", async () => {
    const res = await main({ actionType: "getMetadata" });
    expect(res).toEqual({
      error: {
        statusCode: 400,
        body: { error: "missing header(s) 'authorization'" },
      },
    });
  });
});
