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

import React from 'react';
import { Flex, Heading, Text, View, Button, InlineAlert, Badge, Divider, Grid, ActionButton } from "@adobe/react-spectrum";
import Alert from "@spectrum-icons/workflow/Alert";
import { Violation, ClaimResults } from '../types';
import { copyToClipboard } from '../utils/copyToClipboard';
import { VIOLATION_STATUS, CLAIM_VIOLATION_PREFIX } from '../Constants';
import Copy from '@spectrum-icons/workflow/Copy';
import { extractPodNumber, removePodPrefix, convertSnakeCaseToCamelCase, convertNumberToWords } from '../utils/stringUtils';

interface ClaimsCheckerProps {
    claims: ClaimResults;  // or define a more specific type
    experienceNumber: number;
} 

const ClaimsChecker: React.FC<ClaimsCheckerProps> = ({ claims, experienceNumber }) => {
  // Count total issues
  const totalIssues = Object.values(claims).flat().filter((violation: Violation) => 
    violation.status === VIOLATION_STATUS.Violated
  ).length;

  const handleCopyPress = (violation: string) => copyToClipboard(violation.split('Violated claim:')[1].trim());
  const renderViolation = (title: string, items: Violation[]) => {
    const issueCount = items?.filter(item => 
      item.status === VIOLATION_STATUS.Violated
    ).length;
    const hasViolations = (v: Violation) => v.status === VIOLATION_STATUS.Violated && v.violation;
  
    return (
      <View>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={4}>{title}</Heading>
          {issueCount > 0 ? (
            <Badge variant="negative">{issueCount} issue{issueCount > 1 ? 's' : ''}</Badge>
          ) : (
            <Badge variant="positive">No issues</Badge>
          )}
        </Flex>

        {issueCount > 0 && items.map((item, index) => (
          hasViolations(item) && (
            <View key={index} marginBottom="size-200">
              <Grid
                columns={["size-200", "auto", "auto"]}
                gap="size-100"
                alignItems="start"
              >
                <Alert size="S" color='notice' />
                <Text>{item.violation}</Text>
                { item.violation!.includes(CLAIM_VIOLATION_PREFIX) && 
                  <ActionButton onPress={() => handleCopyPress(item.violation!)}>
                    <Copy />
                  </ActionButton> }
              </Grid>
            </View>
          )
        ))}
      </View>
    );
  };
  const renderAlertMessage = (totalIssues: number) => {
    const emailNumber = experienceNumber + 1;
    let message = "";
    if (totalIssues === 0) {
      message = `No issues on Email ${emailNumber}`;
    } else {
      const numIssues = convertNumberToWords(totalIssues);
      message = `${numIssues} issue${
        totalIssues === 1 ? '' : 's'
      } need${
        totalIssues === 1 ? 's' : ''
      } attention on Email ${emailNumber}`;
    }

    return (
      <InlineAlert width="100%" variant={totalIssues === 0 ? "positive" : "notice"}>
        <Heading>{message}</Heading>
      </InlineAlert>
    );
  };

  // Group violations by pod and field
  const violationsByPodAndField: Record<string, ClaimResults> = {}
  for (const rawField of Object.keys(claims)) {
    const field = removePodPrefix(rawField)
    const pod = extractPodNumber(rawField)
    if (!violationsByPodAndField[pod]) violationsByPodAndField[pod] = {};
    violationsByPodAndField[pod][field] = claims[rawField];
  }

  return (
    <View padding="size-200">
      {/* Status Alert */}
      <Flex gap="size-100"  justifyContent="space-between">
        {renderAlertMessage(totalIssues)}
      </Flex>
      {Object.keys(violationsByPodAndField).map((pod, index, array) => (
        <View key={pod}>
          { pod !== '0' && <Heading level={4}>Section {pod}</Heading> }
          {Object.keys(violationsByPodAndField[pod]).map((fieldName) => (
            <View key={pod+fieldName}>
              {renderViolation(convertSnakeCaseToCamelCase(fieldName), violationsByPodAndField[pod][fieldName])}
            </View>
          ))}
          {index < array.length - 1 && <Divider size="S" marginX="size-400" marginTop="size-0"/>}
        </View>
      ))}
    </View>
  );
};
export default ClaimsChecker;
