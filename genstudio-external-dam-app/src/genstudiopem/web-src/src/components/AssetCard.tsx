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

import React, { useState } from "react";
import { View, Image, Text, Checkbox } from "@adobe/react-spectrum";
import { DamAsset } from "../types";

interface AssetCardProps {
  asset: DamAsset;
  isSelected: boolean;
  onSelect: (asset: DamAsset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  isSelected,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)}KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(1)}MB`;
  };

  // Card styles matching GenStudio interaction states exactly
  const cardStyles: React.CSSProperties = {
    cursor: "pointer",
    position: "relative",
    width: "230px",
    height: "241px",
    borderRadius: "5px", // Figma spec: 5px border radius
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    transition: "box-shadow 0.15s ease-in-out, border-color 0.15s ease-in-out", // Only animate shadow and border color
    transform: "none", // Explicitly ensure no transform effects
    // Always use 2px border - just change transparency to avoid layout shifts
    border: isSelected ? "2px solid #2C2C2C" : "2px solid transparent",
    margin: "0px", // Keep consistent margin always
    // Shadow matching GenStudio cards
    boxShadow: isSelected 
      ? "0px 4px 12px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.1)"
      : "0px 1px 3px rgba(0, 0, 0, 0.1)",
  };

  // Hover styles - using CSS properties that can be applied inline
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (!isSelected) {
      // Only change shadow on hover - keep same margin/border structure
      (e.currentTarget as HTMLDivElement).style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.15), 0px 2px 6px rgba(0, 0, 0, 0.1)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    if (!isSelected) {
      // Only restore shadow on mouse leave - keep same margin/border structure
      (e.currentTarget as HTMLDivElement).style.boxShadow = "0px 1px 3px rgba(0, 0, 0, 0.1)";
    }
  };

  return (
    <div 
      onClick={() => onSelect(asset)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyles}
    >
      <View 
        UNSAFE_style={{ 
          // Image container dimensions - edge-to-edge preview
          position: "relative",
          height: "192px", // Figma spec: 192px image container height
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#F2F4F5", // Figma spec: container background
          // No border radius here - let image go edge-to-edge
        }}
      >
        <Image
          src={asset.thumbnailUrl}
          alt={asset.name}
          objectFit="contain" // Reference image shows full image contained, not cropped
          width="100%"
          height="100%"
          UNSAFE_style={{ 
            // Image edge-to-edge with no border radius
            backgroundColor: "#F2F4F5" // Figma spec: background color
          }}
        />

        <View
          UNSAFE_style={{
            // File type badge overlay - positioned in bottom-right of image area
            position: "absolute",
            right: "8px",
            bottom: "8px", // Position relative to image container bottom
            padding: "3px 5px", // Figma positioning: better padding for text
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Figma spec: rgba(0, 0, 0, 0.4)
            borderRadius: "2px", // Figma spec: 2px border radius
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text 
            UNSAFE_style={{ 
              // Badge text styling - exact specifications provided
              color: "var(--Palette-white, #FFF)", // Exact color specification
              textAlign: "center",
              fontFamily: "Adobe Clean, sans-serif", // Sans serif version
              fontSize: "14px", // Exact font size
              fontStyle: "normal", // Exact font style  
              fontWeight: "700", // Exact font weight
              lineHeight: "130%", // Exact line height (18.2px)
              textTransform: "uppercase"
            }}>
            {asset.fileType}
          </Text>
        </View>

        {/* Custom checkbox - using Spectrum design tokens */}
        {(isHovered || isSelected) && (
          <div 
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              zIndex: 10,
              width: "16px", // Container size --spectrum-global-dimension-size-200
              height: "16px", // Container size --spectrum-global-dimension-size-200
              borderRadius: "8px", // Container corner radius --spectrum-global-dimension-size-100
              backgroundColor: "rgba(255, 255, 255, 0.51)", // Container background
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              padding: "4px", // Padding --spectrum-global-dimension-size-50
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onSelect(asset);
            }}
          >
            <div
              style={{
                width: "12px", // Actual checkbox size
                height: "12px", // Actual checkbox size
                borderRadius: "4px", // Checkbox corner radius --spectrum-global-dimension-size-50
                backgroundColor: isSelected ? "#2C2C2C" : "#FFFFFF",
                border: isSelected ? "2px solid #2C2C2C" : "2px solid rgb(41, 41, 41)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease-in-out",
              }}
            >
              {isSelected && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    color: "#FFFFFF"
                  }}
                >
                  <path
                    d="M11.5 3.5L5.5 9.5L2.5 6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              )}
            </div>
          </div>
        )}
      </View>

      <View 
        UNSAFE_style={{
          // Card details section - with design-spec spacing (7px top padding)
          backgroundColor: "#FFFFFF",
          padding: "7px 12px 8px 12px", // Design spec: ~7px top, maintain sides, less bottom
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          height: "49px", // Keep same total height 
          borderRadius: "0px 0px 5px 5px" // Bottom corners match card border radius
        }}
      >
        <Text
          UNSAFE_style={{
            // Asset title styling - exact specifications provided
            overflow: "hidden",
            color: "var(--Alias-content-neutral-default, #222)", // Exact color specification
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "Adobe Clean, sans-serif", // Sans serif version
            fontSize: "14px", // Exact font size
            fontStyle: "normal", // Exact font style
            fontWeight: "700", // Exact font weight (was 600)
            lineHeight: "130%", // Exact line height (18.2px)
            textAlign: "left",
            marginBottom: "2px", // Reduced margin for better fit
            width: "100%"
          }}
        >
          {asset.name}
        </Text>
        <Text
          UNSAFE_style={{
            // Asset metadata styling - similar to title but lighter weight
            fontFamily: "Adobe Clean, sans-serif", // Sans serif version
            fontSize: "12px", // Slightly smaller than title
            fontStyle: "normal", // Same font style as title
            fontWeight: "400", // Lighter than title (not bolded)
            lineHeight: "130%", // Same line height as title
            color: "#6B6B6B", // Keep existing metadata color
            textAlign: "left"
          }}
        >
          {formatFileSize(asset.metadata?.size || 0)}
        </Text>
      </View>
    </div>
  );
};

export default AssetCard;
