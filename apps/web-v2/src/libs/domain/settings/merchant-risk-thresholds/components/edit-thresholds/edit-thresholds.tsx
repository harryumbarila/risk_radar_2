'use client';
import React from 'react';
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Flex,
  Portal,
} from '@chakra-ui/react';
import { MdCheck, MdOutlineArrowBack } from 'react-icons/md';

import { EditThresholdsDrawerProps } from './edit-thresholds.model';

export default function EditThresholdsDrawer(
  props: React.PropsWithChildren<EditThresholdsDrawerProps>
) {
  return (
    <Drawer.Root
      placement={{ mdDown: 'bottom', md: 'end' }}
      size={{
        mdDown: 'sm',
        md: 'lg',
      }}
    >
      <Drawer.Trigger asChild>{props.children}</Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner padding="4" onClick={(e) => e.stopPropagation()}>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Threshold Details</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Flex gap={4} direction="column"></Flex>
            </Drawer.Body>
            <Drawer.Footer>
              <Box display="flex" flexDirection="column" w="100%" gap={4}>
                <Button flexGrow={1}>
                  <MdCheck size={14} />
                  Update
                </Button>
                <Drawer.ActionTrigger asChild>
                  <Button variant="outline" flexGrow={1}>
                    <MdOutlineArrowBack />
                    Back
                  </Button>
                </Drawer.ActionTrigger>
              </Box>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
