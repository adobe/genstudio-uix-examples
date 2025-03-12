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

const TEST_CLAIMS = [
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

  module.exports = { TEST_CLAIMS };