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

// // New types for DAM
export type DamAsset = {
  id: string;
  name: string;
  fileType: string;
  thumbnailUrl: string;
  url: string;
  metadata: any;
  dateCreated: string;
  dateModified: string;
};

// export interface AssetMetadata {
//   size: number;
//   width?: number;
//   height?: number;
//   description?: string;
//   keywords?: string[];
//   [key: string]: any;
// }

export interface AssetSearchParams {
  query?: string;
  fileTypes?: string[];
  tags?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  limit?: number;
  offset?: number;
}
