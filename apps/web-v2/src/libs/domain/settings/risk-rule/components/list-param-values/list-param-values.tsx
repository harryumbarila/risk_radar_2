import {
  Badge,
  Box,
  Center,
  Dialog,
  Flex,
  Loader,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';

import {
  ColumnDef,
  createColumnHelper,
  PaginationState,
} from '@tanstack/react-table';

import { DataTable } from '@/ui/components/common/organisms/data-table';

import { components } from '@/libs/shared/api/schemas/schema';
import { $riskApi } from '@/libs/shared/api/risk.api';

import { formatDate } from '@/libs/utils/formatter';

import { ParamValuesHistoryProps } from './list-param-values.model';
import React from 'react';

const columnHelper =
  createColumnHelper<
    components['schemas']['RiskRuleParamValuePaginationOutputDto']
  >();

const columns = [
  columnHelper.accessor('value', {
    header: () => 'Value',
    enableSorting: true,
  }),
  columnHelper.accessor('effectiveDate', {
    header: () => 'Effective',
    enableSorting: true,
    cell: (info) => formatDate(info.getValue()),
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('createdBy', {
    header: () => 'Created By',
    enableSorting: true,
    cell: (info) => info.getValue() || '-',
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('createdAt', {
    header: () => 'Created At',
    enableSorting: true,
    cell: (info) => formatDate(info.getValue()),
    meta: {
      align: 'center',
    },
  }),
] as ColumnDef<
  components['schemas']['RiskRuleParamValuePaginationOutputDto']
>[];

const initialItemsPerPage = 10;

export default function ParamValuesHistory(
  props: ParamValuesHistoryProps
): React.JSX.Element {
  const { isOpen, onClose, rule } = props;
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialItemsPerPage,
    });

  const { data, isLoading } = $riskApi.useQuery(
    'get',
    '/v1/risk-rule/param-values',
    {
      params: {
        query: {
          ruleParamId: rule?.id,
        },
      },
    },
    {
      enabled: !!rule?.id,
    }
  );

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Parameter Value History</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              {isLoading ? (
                <Center>
                  <Loader />
                </Center>
              ) : (
                <VStack p={6} gap={4}>
                  <Text>Viewing history for:</Text>

                  <Flex gap={2}>
                    <Box className="flex-1">
                      <Text fontWeight="bold">{rule?.definition}</Text>
                    </Box>
                    <Badge>
                      {data?.data.length} record
                      {data?.data.length !== 1 ? 's' : ''}
                    </Badge>
                  </Flex>

                  {data && (
                    <DataTable
                      data={{
                        data: data.data,
                        count: data.pageCount,
                        page: data?.page,
                        pageCount: data.pageCount,
                        total: data.data.length,
                      }}
                      columns={columns}
                      isLoading={false}
                      enablePagination
                      pagination={{ pageIndex, pageSize }}
                      onSetPagination={setPagination}
                    />
                  )}
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
