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
import { Claim } from '@adobe/genstudio-uix-sdk'
export const extensionId: string = 'genstudio-create-additional-context-app';
export const extensionLabel: string = 'GenStudio UIX Create Additional Context App';
export const ICON_DATA_URI: string = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTExIiBoZWlnaHQ9IjExMSIgdmlld0JveD0iMCAwIDExMSAxMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF85MV8zNDQ3NCkiPgo8cGF0aCBkPSJNOC44NDEgMEgxMDIuMTZDMTA0LjUwNSAwLjAwMDI2NTE5NyAxMDYuNzUzIDAuOTMxODQyIDEwOC40MTEgMi41ODk4MkMxMTAuMDY5IDQuMjQ3OCAxMTEgNi40OTYzOSAxMTEgOC44NDFWMTAyLjE2QzExMSAxMDQuNTA1IDExMC4wNjggMTA2Ljc1MyAxMDguNDEgMTA4LjQxMUMxMDYuNzUyIDExMC4wNjkgMTA0LjUwNCAxMTEgMTAyLjE1OSAxMTFIOC44NDFDNi40OTYyMiAxMTEgNC4yNDc0OCAxMTAuMDY5IDIuNTg5NDcgMTA4LjQxMUMwLjkzMTQ2IDEwNi43NTMgMCAxMDQuNTA0IDAgMTAyLjE1OUwwIDguODQxQzAgNi40OTYyMiAwLjkzMTQ2IDQuMjQ3NDggMi41ODk0NyAyLjU4OTQ3QzQuMjQ3NDggMC45MzE0NiA2LjQ5NjIyIDAgOC44NDEgMFoiIGZpbGw9IiNGRkVBMDAiLz4KPHBhdGggZD0iTTQ0LjU2MTIgNzguNDIzMUg1NC4xMjQyTDU5LjIzMTIgMzIuNTc4MUg1Mi45NDQyTDQ5LjIxMTIgNjguOTkyMUw0NS42MDkyIDMyLjU3ODFIMzguNjY3MkwzNS4xOTYyIDY4LjczMDFMMzEuMzMyMiAzMi41NzgxSDI0LjMyNDJMMjkuNDMyMiA3OC40MjMxSDM5LjMyNDJMNDEuOTQ0MiA1My45OTQxTDQ0LjU2MTIgNzguNDIzMVpNNzkuMjcyMiA3OC40MjMxSDg2LjY3MjJMNzYuNjUyMiA1My4wMTIxTDg2LjY3MzIgMzIuNTc4MUg3OS40NzMyTDcwLjAzODIgNTIuNTUzMVYzMi41NzgxSDYyLjgzODJWNzguNDIzMUg3MC4wMzgyVjY0LjM0MjFMNzIuMjY1MiA2MC4xNTAxTDc5LjI3MjIgNzguNDIzMVoiIGZpbGw9IiMyMDIwMjAiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF85MV8zNDQ3NCI+CjxyZWN0IHdpZHRoPSIxMTEiIGhlaWdodD0iMTExIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";
interface ClaimsLibrary {
    id: string;
    name: string;
    claims: Claim[];
  }
  
export const TEST_CLAIMS: ClaimsLibrary[] = [
    {
      id: "efficacy-claims",
      name: "Efficacy Claims",
      claims: [
        {
          id: "claim1",
          description: "Clinically proven to reduce joint inflammation by up to 50%."
        },
        {
          id: "claim2",
          description: "Alleviates chronic pain associated with Chronexa within 2 weeks."
        },
        {
          id: "claim3",
          description: "Demonstrates a 60% improvement in joint mobility over 6 months."
        }
      ]
    },
    {
      id: "safety-claims",
      name: "Safety and Tolerability Claims",
      claims: [
        {
          id: "claim4",
          description: "Demonstrated a favorable safety profile with over 95% adherence in trials."
        },
        {
          id: "claim5",
          description: "No significant interactions with common NSAIDs and corticosteroids."
        },
        {
          id: "claim6",
          description: "Approved for patients aged 16 to 80 years."
        }
      ]
    },
    {
      id: "dosage-claims",
      name: "Dosage and Administration Claims",
      claims: [
        {
          id: "claim7",
          description: "Taken once daily for consistent symptom control."
        },
        {
          id: "claim8",
          description: "Available in 100 mg and 200 mg tablet forms."
        },
        {
          id: "claim9",
          description: "Can be taken with or without food for patient convenience."
        }
      ]
    },
    {
      id: "side-effects-claims",
      name: "Side Effects Claims",
      claims: [
        {
          id: "claim10",
          description: "Most common side effect is mild fatigue, reported in fewer than 8% of patients."
        },
        {
          id: "claim11",
          description: "No significant impact on cardiovascular health."
        },
        {
          id: "claim12",
          description: "Mild headaches reported in less than 3% of patients, typically resolving within a week."
        }
      ]
    }
  ];