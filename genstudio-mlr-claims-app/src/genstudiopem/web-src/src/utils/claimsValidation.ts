    // function that validate claims
// takes in a string, list of claims
// loop through list of claims
// fuzzy match the claim with the string
// check if claim present matches or does not match
// return the result

// hardcoded validation for summit

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
    // // hardcoded validation for summit
    // switch (experienceNumber) {
    //     case 0:
    //         return {
    //             "pre_header": [
    //                 {
    //                     claimStatus: claimStatus.Valid
    //                 }
    //             ],
    //             "header": [
    //                 {
    //                     claimStatus: claimStatus.Valid
    //                 }
    //             ],
    //             "body": [
    //                 {
    //                     claimStatus: claimStatus.Violated,
    //                     claimViolation: 'The claim "Improved joint mobility within just 2 weeks" is violated, as clinical trials show significant improvements in joint mobility at 8 weeks, not 2. '
    //                 },
    //                 {
    //                     claimStatus: claimStatus.PartiallyViolated,
    //                     claimViolation: 'The claim "Minimal risk of side effects, with fewer than 2% of patients reporting any issues" is partially violated, as actual trial data indicates side effects occurred in up to 5% of patients.'
    //                 }
    //             ]
    //         }
    //     case 1:
    //         return {
    //             "pre_header": [
    //                 {
    //                     claimStatus: claimStatus.Valid
    //                 }
    //             ],
    //             "header": [
    //                 {
    //                     claimStatus: claimStatus.Violated,
    //                     claimViolation: 'The claim "70% reduction in flare-ups" is violated, as the actual documented reduction in flare-ups was 45%.',
    //                 },
    //                 {
    //                     claimStatus: claimStatus.PartiallyViolated,
    //                     claimViolation: 'The claim "Minimal gastrointestinal side effects, with reports in less than 3% of patients" is partially violated, as clinical data indicates side effects occurred in up to 5% of patients.'
    //                 }
    //             ]
    //         }
    //     case 2:
    //         return {
    //             "pre_header": [
    //                 {
    //                     claimStatus: claimStatus.Valid
    //                 }
    //             ],
    //             "header": [
    //                 {
    //                     claimStatus: claimStatus.Violated,
    //                     claimViolation: "The claim “No significant impact on sleep patterns or energy levels” is violated, as trial data showed mild fatigue in up to 8% of patients."
    //                 },
    //                 {
    //                     claimStatus: claimStatus.PartiallyViolated,
    //                     claimViolation: "The claim “65% reduction in systemic inflammation markers” is partially violated. While reductions were observed, the documented number was closer to 60% in long-term studies."
    //                 }
    //             ]
    //         }
    //     default:
    //         return {};
    // }
};

