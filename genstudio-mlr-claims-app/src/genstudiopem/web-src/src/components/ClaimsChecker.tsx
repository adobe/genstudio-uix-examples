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
import { Flex, Heading, Text, View, Button, InlineAlert, Badge } from "@adobe/react-spectrum";
import Alert from "@spectrum-icons/workflow/Alert";
import { claimStatus } from '../utils/claimsValidation';
import { copyToClipboard } from '../utils/copyToClipboard';

interface ClaimsCheckerProps {
    claims: any;  // or define a more specific type
    experienceNumber: number;
  } 

  const ClaimsChecker: React.FC<ClaimsCheckerProps> = ({ claims, experienceNumber }) => {
  // Count total issues
  const totalIssues = Object.values(claims).flat().filter((claim: any) => 
    claim.claimStatus === claimStatus.Violated
  ).length;
  
  const renderSection = (title: string, items: Array<{ claimStatus: string; claimViolation?: string }>) => {
    const issueCount = items?.filter(item => 
      item.claimStatus === 'violated'
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
          item.claimStatus === 'violated' && item.claimViolation && (
            <View key={index} marginY="size-100">
              <Flex gap="size-100" alignItems="start">
                <Alert size="S" />
                <View>
                  <Text>{item.claimViolation}</Text>
                    {/* Copy Claim Button */}
                    <View marginTop="size-100">
                    <Button variant="secondary" style="fill" onPress={() => copyToClipboard(item.claimViolation!)}
                    >
                      Copy Claim
                    </Button>
                    </View>
                </View>
              </Flex>
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
  
    return (
      <View padding="size-200">
        {/* Status Alert */}
          <Flex gap="size-100"  justifyContent="space-between">
            {message(totalIssues)}
          </Flex>
  
        {renderSection('Pre header', claims.pre_header)}
        {renderSection('Header', claims.header)}
        {renderSection('Body', claims.body)}
      </View>
    );
  };
export default ClaimsChecker;
