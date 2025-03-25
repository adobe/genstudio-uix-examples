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
import { Claim } from "@adobe/genstudio-uix-sdk";
export const extensionId: string = "genstudio-summit-mlr-app";
export const extensionLabel: string = "MLR for Celestix";
export const ICON_DATA_URI: string =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQiIGhlaWdodD0iNDciIHZpZXdCb3g9IjAgMCA1NCA0NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00MS42MjA5IDYuOTk5NzZDMzcuMDAxMiA4LjA3Mzk2IDMxLjA2NzIgMTAuOTQ2NyAyNC45ODEgMTUuNDQ2M0MxOC44OTQ4IDE5Ljk0NTkgMTMuOTg1IDI1LjA5MDIgMTAuOTQ4NiAyOS42NzYyQzkuNDIzNTIgMzEuOTc5NiA4LjM0MjAzIDMzLjY4MDcgNy44ODU1OSAzNS4zMDk3QzcuNDk1MTMgMzYuNzAzMSA3LjEwNDY2IDM2LjgwOTcgNy4wMjAwOSAzOS43NDA0QzcuODAxMDIgNDMuNzQwNCAxMS42NDEyIDQ0LjQ1NiAxMi45ODQzIDQ0Ljc2NzRDMTQuMzE0MiA0NS4wNzU3IDE2LjE3MjggNDUuMDIwOSAxOC40OTMyIDQ0LjQ4MTNDMjMuMTEyOSA0My40MDcxIDI5LjA0NjkgNDAuNTM0NCAzNS4xMzMxIDM2LjAzNDhDNDEuMjE5MiAzMS41MzUyIDQ2LjEyOTEgMjYuMzkwOSA0OS4xNjU0IDIxLjgwNDlDNTAuNjkwNiAxOS41MDE0IDUxLjY1NjkgMTcuNDY3NyA1Mi4xMTMzIDE1LjgzODhDNTIuNzA0NCAxMy43NDA0IDUzLjA5NDkgMTAuMjQwNCA1MC43NTIxIDguMjQwMzlDNTAuNTgyMiA3Ljg2MzY1IDQ4LjU4MSA3LjA1MTc2IDQ3LjIzNzkgNi43NDAzOUM0NS45MDggNi40MzIxIDQzLjk0MTMgNi40NjAyIDQxLjYyMDkgNi45OTk3NlpNNDcuOTY0NCAwLjgwOTY2M0M1MC4wMzUzIDEuMjg5NzQgNTIuMDU2MiAyLjQ5NzUyIDUzLjE4MDMgNC45OTA1NEM1NC4zMDQzIDcuNDgzNTUgNTQuMTEwNyAxMC4zMjg2IDUzLjM5OTkgMTIuODY1MkM1Mi42ODQ1IDE1LjQxODEgNTEuMzQyNiAxOC4wNzY3IDQ5LjYxNTcgMjAuNjg1QzQ2LjE0OCAyNS45MjI2IDQwLjc3ODYgMzEuNDc5NyAzNC4zNTIxIDM2LjIzMDlDMjcuOTI1NyA0MC45ODIxIDIxLjQ4MjcgNDQuMTU3OSAxNi4yMDY2IDQ1LjM4NDhDMTMuNTc5MiA0NS45OTU3IDExLjExMDIgNDYuMTU0NiA5LjAyNTk0IDQ1LjY3MTRDNi45NTUwMiA0NS4xOTEzIDQuOTM0MTMgNDMuOTgzNiAzLjgxMDEgNDEuNDkwNUMyLjY4NjA4IDM4Ljk5NzUgMi44Nzk3IDM2LjE1MjUgMy41OTA0OCAzMy42MTU5QzQuMzA1ODMgMzEuMDYzIDUuNjQ3NzUgMjguNDA0NCA3LjM3NDY4IDI1Ljc5NjFDMTAuODQyNCAyMC41NTg1IDE2LjIxMTcgMTUuMDAxMyAyMi42MzgyIDEwLjI1MDJDMjkuMDY0NyA1LjQ5ODk3IDM1LjUwNzcgMi4zMjMxMyA0MC43ODM3IDEuMDk2M0M0My40MTEyIDAuNDg1MzQgNDUuODgwMiAwLjMyNjUwNiA0Ny45NjQ0IDAuODA5NjYzWiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzI0OTFfMTE0NjkpIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDMuMjE3NSAzMC4xNzYyQzQwLjE4MTIgMjUuNTkwMiAzNS4yNzEzIDIwLjQ0NTkgMjkuMTg1MSAxNS45NDYzQzIzLjA5OSAxMS40NDY3IDE3LjE2NSA4LjU3Mzk2IDEyLjU0NTMgNy40OTk3NkMxMC4yMjQ4IDYuOTYwMiA4LjUzMzY0IDYuNjExNCA3LjIwMzc3IDYuOTE5NjlDNi4wNjYxMyA3LjE4MzQxIDUuNzk4ODUgNi44MDM2NiAzLjc3NDUxIDguMTc1MjRDMS40NTk3NiAxMS4wNDEzIDIuODk1ODcgMTUuNjU3NyAzLjM1Njg3IDE3LjMwMjlDMy44MTMzMSAxOC45MzE4IDQuNzc5NjQgMjAuOTY1NSA2LjMwNDc1IDIzLjI2OUM5LjM0MTA5IDI3Ljg1NSAxNC4yNTA5IDMyLjk5OTMgMjAuMzM3MSAzNy40OTg5QzI2LjQyMzMgNDEuOTk4NSAzMi4zNTczIDQ0Ljg3MTIgMzYuOTc3IDQ1Ljk0NTRDMzkuMjk3NCA0Ni40ODUgNDEuMTU2IDQ2LjUzOTggNDIuNDg1OSA0Ni4yMzE1QzQ0LjIwMDUgNDUuODM3NyA0Ni43NjI4IDQ0LjUyMDcgNDYuOTQ0MSA0MC45MjI3QzQ3LjExMzkgNDAuNTQ1OSA0Ni42NjI0IDM3LjkyMDggNDYuMjAxNCAzNi4yNzU2QzQ1Ljc0NSAzNC42NDY2IDQ0Ljc0MjYgMzIuNDc5NiA0My4yMTc1IDMwLjE3NjJaTTUwLjU3NTcgMzQuMTE1OUM1MS4yODY0IDM2LjY1MjUgNTEuNDgwMSAzOS40OTc1IDUwLjM1NiA0MS45OTA1QzQ5LjIzMiA0NC40ODM2IDQ3LjIxMTEgNDUuNjkxMyA0NS4xNDAyIDQ2LjE3MTRDNDMuMDU2IDQ2LjY1NDYgNDAuNTg3IDQ2LjQ5NTcgMzcuOTU5NSA0NS44ODQ4QzMyLjY4MzUgNDQuNjU3OSAyNi4yNDA1IDQxLjQ4MjEgMTkuODE0IDM2LjczMDlDMTMuMzg3NSAzMS45Nzk3IDguMDE4MiAyNi40MjI2IDQuNTUwNDYgMjEuMTg1QzIuODIzNTMgMTguNTc2NyAxLjQ4MTYxIDE1LjkxODEgMC43NjYyNjUgMTMuMzY1MkMwLjA1NTQ4MzMgMTAuODI4NiAtMC4xMzgxMzkgNy45ODM1NSAwLjk4NTg4NSA1LjQ5MDUzQzIuMTA5OTEgMi45OTc1MiA0LjEzMDggMS43ODk3NCA2LjIwMTczIDEuMzA5NjZDOC4yODU5NCAwLjgyNjUwNiAxMC43NTQ5IDAuOTg1MzQxIDEzLjM4MjQgMS41OTYzQzE4LjY1ODUgMi44MjMxMyAyNS4xMDE0IDUuOTk4OTcgMzEuNTI3OSAxMC43NTAyQzM3Ljk1NDQgMTUuNTAxMyA0My4zMjM3IDIxLjA1ODUgNDYuNzkxNSAyNi4yOTYxQzQ4LjUxODQgMjguOTA0NCA0OS44NjAzIDMxLjU2MyA1MC41NzU3IDM0LjExNTlaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfMjQ5MV8xMTQ2OSkiLz4KPHBhdGggZD0iTTM0IDI4QzM0IDMxLjg2NiAzMC44NjYgMzUgMjcgMzVDMjMuMTM0IDM1IDIwIDMxLjg2NiAyMCAyOEMyMCAyNC4xMzQgMjMuMTM0IDIxIDI3IDIxQzMwLjg2NiAyMSAzNCAyNC4xMzQgMzQgMjhaIiBmaWxsPSJ1cmwoI3BhaW50Ml9yYWRpYWxfMjQ5MV8xMTQ2OSkiLz4KPHBhdGggZD0iTTE0IDEzLjVDMTQgMTUuOTg1MyAxMS45ODUzIDE4IDkuNSAxOEM3LjAxNDcyIDE4IDUgMTUuOTg1MyA1IDEzLjVDNSAxMS4wMTQ3IDcuMDE0NzIgOSA5LjUgOUMxMS45ODUzIDkgMTQgMTEuMDE0NyAxNCAxMy41WiIgZmlsbD0idXJsKCNwYWludDNfcmFkaWFsXzI0OTFfMTE0NjkpIi8+CjxwYXRoIGQ9Ik00OSAxMy41QzQ5IDE1Ljk4NTMgNDYuOTg1MyAxOCA0NC41IDE4QzQyLjAxNDcgMTggNDAgMTUuOTg1MyA0MCAxMy41QzQwIDExLjAxNDcgNDIuMDE0NyA5IDQ0LjUgOUM0Ni45ODUzIDkgNDkgMTEuMDE0NyA0OSAxMy41WiIgZmlsbD0idXJsKCNwYWludDRfcmFkaWFsXzI0OTFfMTE0NjkpIi8+CjxwYXRoIGQ9Ik00MyAzOS41QzQzIDQwLjg4MDcgNDEuODgwNyA0MiA0MC41IDQyQzM5LjExOTMgNDIgMzggNDAuODgwNyAzOCAzOS41QzM4IDM4LjExOTMgMzkuMTE5MyAzNyA0MC41IDM3QzQxLjg4MDcgMzcgNDMgMzguMTE5MyA0MyAzOS41WiIgZmlsbD0idXJsKCNwYWludDVfcmFkaWFsXzI0OTFfMTE0NjkpIi8+CjxwYXRoIGQ9Ik0xNSAzOS41QzE1IDQwLjg4MDcgMTMuODgwNyA0MiAxMi41IDQyQzExLjExOTMgNDIgMTAgNDAuODgwNyAxMCAzOS41QzEwIDM4LjExOTMgMTEuMTE5MyAzNyAxMi41IDM3QzEzLjg4MDcgMzcgMTUgMzguMTE5MyAxNSAzOS41WiIgZmlsbD0idXJsKCNwYWludDZfcmFkaWFsXzI0OTFfMTE0NjkpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjQ5MV8xMTQ2OSIgeDE9IjUxLjIzNjMiIHkxPSI2LjU1OTU0IiB4Mj0iMS4wMjY1OSIgeTI9IjI5LjE5NzUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzAwMUFGRiIvPgo8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iIzAwQ0NGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDczRkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzI0OTFfMTE0NjkiIHgxPSI0OC4zMjI2IiB5MT0iNDAuNjE5MiIgeDI9Ii0xLjg4NzA3IiB5Mj0iMTcuOTgxMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDAxQUZGIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjMDBDQ0ZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwNzNGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50Ml9yYWRpYWxfMjQ5MV8xMTQ2OSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyNyAyOCkgcm90YXRlKDkwKSBzY2FsZSg3KSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwMENDRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAxQUZGIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQzX3JhZGlhbF8yNDkxXzExNDY5IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDkuNSAxMy41KSByb3RhdGUoOTApIHNjYWxlKDQuNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBDQ0ZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwMUFGRiIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50NF9yYWRpYWxfMjQ5MV8xMTQ2OSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg0NC41IDEzLjUpIHJvdGF0ZSg5MCkgc2NhbGUoNC41KSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwMENDRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAxQUZGIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ1X3JhZGlhbF8yNDkxXzExNDY5IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDQwLjUgMzkuNSkgcm90YXRlKDkwKSBzY2FsZSgyLjUpIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzAwQ0NGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDFBRkYiLz4KPC9yYWRpYWxHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDZfcmFkaWFsXzI0OTFfMTE0NjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuNSAzOS41KSByb3RhdGUoOTApIHNjYWxlKDIuNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBDQ0ZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwMUFGRiIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=";
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
        description:
          "Clinically proven to reduce joint inflammation by up to 50%.",
      },
      {
        id: "claim2",
        description:
          "Alleviates chronic pain associated with Chronexa within 2 weeks.",
      },
      {
        id: "claim3",
        description:
          "Demonstrates a 60% improvement in joint mobility over 6 months.",
      },
    ],
  },
  {
    id: "safety-claims",
    name: "Safety and Tolerability Claims",
    claims: [
      {
        id: "claim4",
        description:
          "Demonstrated a favorable safety profile with over 95% adherence in trials.",
      },
      {
        id: "claim5",
        description:
          "No significant interactions with common NSAIDs and corticosteroids.",
      },
      {
        id: "claim6",
        description: "Approved for patients aged 16 to 80 years.",
      },
    ],
  },
  {
    id: "dosage-claims",
    name: "Dosage and Administration Claims",
    claims: [
      {
        id: "claim7",
        description: "Taken once daily for consistent symptom control.",
      },
      {
        id: "claim8",
        description: "Available in 100 mg and 200 mg tablet forms.",
      },
      {
        id: "claim9",
        description:
          "Can be taken with or without food for patient convenience.",
      },
    ],
  },
  {
    id: "side-effects-claims",
    name: "Side Effects Claims",
    claims: [
      {
        id: "claim10",
        description:
          "Most common side effect is mild fatigue, reported in fewer than 8% of patients.",
      },
      {
        id: "claim11",
        description: "No significant impact on cardiovascular health.",
      },
      {
        id: "claim12",
        description:
          "Mild headaches reported in less than 3% of patients, typically resolving within a week.",
      },
    ],
  },
];

export const VIOLATION_STATUS = {
  Valid: "valid",
  Violated: "violated",
  N_A: "n/a",
} as const;

export const VIOLATION_PREFIX = "Violated: ";
export const CLAIM_VIOLATION_PREFIX = "Violated claim: ";
export const POD_PREFIX = "pod";
