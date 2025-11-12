'use client';
import React from 'react';
import { Text, Tooltip } from '@chakra-ui/react';
import { getRuleName, getRuleAbbreviation } from '../../utils/ruleNames';

interface RuleLabelProps {
  ruleId: string;
  showFullName?: boolean;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}

/**
 * Component to display a rule code with a tooltip showing the full name
 */
export default function RuleLabel({
  ruleId,
  showFullName = false,
  fontSize,
  fontWeight,
  color,
}: RuleLabelProps) {
  const abbreviation = getRuleAbbreviation(ruleId);
  const fullName = getRuleName(ruleId);

  // If full name is requested or rule not found, show full name
  if (showFullName || fullName === ruleId) {
    return (
      <Text fontSize={fontSize} fontWeight={fontWeight} color={color}>
        {fullName}
      </Text>
    );
  }

  // Show abbreviation with tooltip
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Text
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={color}
          cursor="help"
          textDecoration="underline"
          textDecorationStyle="dotted"
          textUnderlineOffset="2px"
        >
          {abbreviation}
        </Text>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>
          <Tooltip.Arrow />
          {fullName}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}

