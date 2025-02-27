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
import { TEST_CLAIMS } from '../Constants';
import { Key } from 'react';


export const claimStatus = {
    Valid: 'valid',
    Violated: 'violated',
    N_A: 'n/a'
}

function checkClaim(text: string, claim: string, threshold: number = 0.2): "valid" | "violated" | "n/a" {
    const textLower = text.toLowerCase();
    const claimLower = claim.toLowerCase();

    if (textLower.includes(claimLower)) {
        return "valid";
    }

    // remove numbers from text and claim
    // hack to get claims to violate that are the same except for numbers
    const textWithoutNumbers = textLower.replace(/[0-9]/g, '');
    const claimWithoutNumbers = claimLower.replace(/[0-9]/g, '');

    if (textWithoutNumbers.includes(claimWithoutNumbers)) {
        return "violated";
    }

    return "n/a";
}

// a poor man's claims validation
// if contains exact match, return valid
// if contains exact match without numbers, return violated
// otherwise return n/a
export const validateClaims = (experience: Experience, experienceNumber: number, selectedClaimLibrary: Key) => {
    const filteredClaims = TEST_CLAIMS.find(library => library.id === selectedClaimLibrary)?.claims;

    if (!filteredClaims) {
        return {};
    }

    const result: Record<string, any[]> = {};
    
    // Use for...of instead of forEach for better control flow
    for (const [fieldName, entry] of Object.entries(experience.experienceFields)) {
        if (typeof entry.fieldValue === 'string') {
            result[fieldName] = [];
            for (const claim of filteredClaims) {
                const fieldClaim = {
                    claimStatus: checkClaim(entry.fieldValue, claim.description),
                    claimViolation: `Violated claim: ${claim.description}`
                };
                result[fieldName].push(fieldClaim);
            }
        }
    }

    return result;
}
