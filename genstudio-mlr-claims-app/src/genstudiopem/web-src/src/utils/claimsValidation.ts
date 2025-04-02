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

// function that validate claims
// takes in a string, list of claims
// loop through list of claims
// fuzzy match the claim with the string
// check if claim present matches or does not match
// return the result

import { Experience } from '@adobe/genstudio-uix-sdk';
import { CLAIM_VIOLATION_PREFIX, TEST_CLAIMS, VIOLATION_PREFIX, VIOLATION_STATUS } from '../Constants';
import { ClaimResults, Violation } from '../types'
import { Key } from 'react';
import { removePodPrefix } from './stringUtils';

const maxCharacterLimits = {
  header: 80,
  pre_header: 100,
  body: 300,
}

function checkClaim(text: string, claim: string): Violation {
  // Trim whitespace and normalize spaces to help with matching
    const normalizedText=text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[,.!?;:]/g,'');
    const normalizedClaim=claim.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[,.!?;:]/g,'');

  if (normalizedText.includes(normalizedClaim)) {
        return { status: VIOLATION_STATUS.Valid }
  }

  // remove numbers from text and claim
  // hack to get claims to violate that are the same except for numbers
    const normalizedTextWithoutNumbers = normalizedText.replace(/[0-9]/g, '');
    const normalizedClaimWithoutNumbers = normalizedClaim.replace(/[0-9]/g, '');

    return normalizedTextWithoutNumbers.includes(normalizedClaimWithoutNumbers) ? 
        {
        status: VIOLATION_STATUS.Violated,
            violation: CLAIM_VIOLATION_PREFIX + claim
        } : { status: VIOLATION_STATUS.N_A }
}

function checkCharacterLimits(fieldName: string, text: string): Violation {
  // Check if field has a character limit and if text exceeds it
    const extractedFieldName = removePodPrefix(fieldName)
    const limit = maxCharacterLimits[extractedFieldName as keyof typeof maxCharacterLimits];
  if (limit && text.length > limit) {
    return {
      status: VIOLATION_STATUS.Violated,
            violation: `${VIOLATION_PREFIX}Max character limit for ${fieldName} is ${limit}`
  }
    }
    return { status: VIOLATION_STATUS.N_A }
}

// a poor man's claims validation
// if contains exact match, return valid
// if contains exact match without numbers, return violated
// otherwise return n/a
export const validateClaims = (
  experience: Experience,
  selectedClaimLibraries: Key[]
) => {
  const filteredClaims = TEST_CLAIMS.find((library) =>
    selectedClaimLibraries.includes(library.id)
  )?.claims;

  const result: ClaimResults = {};
  const experienceFields = experience.experienceFields;

  // Use for...of instead of forEach for better control flow
  for (const [fieldName, entry] of Object.entries(experienceFields)) {
    if (typeof entry.fieldValue === "string") {
      result[fieldName] = [];
      filteredClaims?.forEach((claim) => {
        result[fieldName].push(checkClaim(entry.fieldValue, claim.description));
      });
      result[fieldName].push(checkCharacterLimits(fieldName, entry.fieldValue));
    }
  }

  return result;
};
