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

import { Experience } from "@adobe/genstudio-uix-sdk";

const EXPERIENCE_STORAGE_KEY = "current-experience";

// Save experience to localStorage
export const saveExperience = (experience: Experience): void => {
  try {
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(experience));
  } catch (error) {
    console.error("Error saving experience to localStorage:", error);
  }
};

// Get experience from localStorage
export const getStoredExperience = (): Experience | null => {
  try {
    const stored = localStorage.getItem(EXPERIENCE_STORAGE_KEY);
    if (!stored) return null;
    
    const experience = JSON.parse(stored);
    return experience;
  } catch (error) {
    console.error("Error getting experience from localStorage:", error);
    return null;
  }
}; 