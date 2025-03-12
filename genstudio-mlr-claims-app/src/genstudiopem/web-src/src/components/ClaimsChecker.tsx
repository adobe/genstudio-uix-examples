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
import { Violation } from '../utils/claimsValidation';
import { copyToClipboard } from '../utils/copyToClipboard';
import { VIOLATION_STATUS } from '../Constants';
import Copy from '@spectrum-icons/workflow/Copy';

interface ClaimsCheckerProps {
    claims: any;  // or define a more specific type
    experienceNumber: number;
} 

const ClaimsChecker: React.FC<ClaimsCheckerProps> = ({ claims, experienceNumber }) => {
  // Count total issues
  const totalIssues = Object.values(claims).flat().filter((violation: any) => 
    violation.status === VIOLATION_STATUS.Violated
  ).length;

  const renderCopyButton = (violation: string) => {
    return (
      <ActionButton onPress={() => copyToClipboard(violation.split('Violated claim:')[1].trim())}>
        <Copy />
      </ActionButton>
    )
  }

  const renderViolation = (title: string, items: Array<{ status: string; violation?: string }>) => {
    const issueCount = items?.filter(item => 
      item.status === VIOLATION_STATUS.Violated
    ).length;
  
    return (
      <View marginY="size-200">
        <Flex justifyContent="space-between" alignItems="center" marginBottom="size-200">
          <Heading level={4}>{title}</Heading>
          {issueCount > 0 ? (
            <Badge variant="negative">{issueCount} issue{issueCount > 1 ? 's' : ''}</Badge>
          ) : (
            <Badge variant="positive">No issues</Badge>
          )}
        </Flex>

        {issueCount > 0 && items.map((item, index) => (
          item.status === VIOLATION_STATUS.Violated && item.violation && (
            <View key={index} marginY="size-100">
              <Grid
                columns={["size-200", "auto", "auto"]}
                gap="size-100"
                alignItems="start"
              >
                <Alert size="S" color='notice' />
                <Text>{item.violation}</Text>
                { item.violation!.includes('Violated claim:') && renderCopyButton(item.violation) }
              </Grid>
            </View>
          )
        ))}
      </View>
    );
  };
  const message = (totalIssues: number) =>  {
    switch (totalIssues) {
      case 0:
        return <InlineAlert variant="positive" width="100%"><Heading>No issues on Email {experienceNumber + 1}</Heading></InlineAlert>
      case 1:
        return <InlineAlert variant="notice"  width="100%"><Heading>1 issue needs attention on Email {experienceNumber + 1}</Heading></InlineAlert>
      default:
        return <InlineAlert variant="notice" width="100%"><Heading>{totalIssues} issues need attention on Email {experienceNumber + 1}</Heading></InlineAlert>
    }
  }

  // Group violations by pod and field
  const violationsByPodAndField: Record<string, Record<string, Violation[]>> = {}
  for (const rawField of Object.keys(claims)) {
    const field = rawField.replace(/pod\d+_/, '')
    const match = rawField.match(/^pod(\d+)_/i);
    const pod = match ? match[1] : '0';
    if (!violationsByPodAndField[pod]) violationsByPodAndField[pod] = {};
    violationsByPodAndField[pod][field] = claims[rawField];
  }

  const camelcase = (str: string) => {
    return str.replace(/(?:^|_)(\w)/g, (_, char) => char.toUpperCase());
  }

  return (
    <View padding="size-200">
      {/* Status Alert */}
      <Flex gap="size-100"  justifyContent="space-between">
        {message(totalIssues)}
      </Flex>
      {Object.keys(violationsByPodAndField).map((pod, index, array) => (
        <View key={pod}>
          { pod!== '0' && <Heading level={5}>Section {pod}</Heading> }
          {Object.keys(violationsByPodAndField[pod]).map((fieldName) => (
            <View key={fieldName}>
              {renderViolation(camelcase(fieldName), violationsByPodAndField[pod][fieldName])}
            </View>
          ))}
          {index < array.length - 1 && <Divider size="S" />}
        </View>
      ))}
    </View>
  );
};
export default ClaimsChecker;
