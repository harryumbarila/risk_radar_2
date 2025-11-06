'use client';
import React from 'react';

import {
  Flex,
  Heading,
  Alert,
  Text,
  Stack,
  SimpleGrid,
  Card,
  Button,
  Box,
} from '@chakra-ui/react';
import { Chart, useChart } from '@chakra-ui/charts';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
} from 'recharts';

import { PaginationState } from '@tanstack/react-table';

import { FormProvider, useForm } from 'react-hook-form';

import { Toaster } from '@/ui/components/common/atoms';
import { DataTable } from '@/ui/components/common/organisms/data-table';
import { InputField } from '@/ui/components/form';

import { $riskApi } from '@/libs/shared/api/risk.api';

import { columnsBoards } from './board.model';

const initialItemsPerPage = 50;

export default function AutoHoldBoardPage() {
  const { data, isLoading, isError } = $riskApi.useSuspenseQuery(
    'get',
    '/v1/auto-hold-exception'
  );
  const methods = useForm();

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialItemsPerPage,
    });

  const chart = useChart({
    data: [
      { sales: 63000, month: 'June' },
      { sales: 72000, month: 'July' },
      { sales: 85000, month: 'August' },
      { sales: 79000, month: 'September' },
      { sales: 90000, month: 'October' },
      { sales: 95000, month: 'November' },
      { sales: 88000, month: 'December' },
    ],
    series: [{ name: 'sales', color: 'teal.solid' }],
  });

  return (
    <Flex flexDirection="column" gap={4}>
      <Heading size="lg" color="brand.700">
        Risk Auto Hold Summary
      </Heading>

      <Card.Root>
        <Card.Body className="pt-6">
          <SimpleGrid
            columns={{
              base: 1,
              md: 3,
            }}
            gap={4}
          >
            <FormProvider {...methods}>
              <Box>
                <InputField type="date" label="Report From" name="startDate" />
              </Box>
              <Box>
                <InputField type="date" label="Report To" name="endDate" />
              </Box>
              <Flex justifyContent="flex-end" alignItems="flex-end">
                <Button type="button">Generate Report</Button>
              </Flex>
            </FormProvider>
          </SimpleGrid>
        </Card.Body>
      </Card.Root>

      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <Stack>
          <Text fontWeight="bold">
            TSYS auth data auto hold rules effectiveness for Merchant count 4663
          </Text>
          <Chart.Root maxH="sm" chart={chart}>
            <BarChart data={chart.data}>
              <CartesianGrid
                stroke={chart.color('border.muted')}
                vertical={false}
              />
              <XAxis
                axisLine={false}
                tickLine={false}
                dataKey={chart.key('month')}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={chart.formatNumber({
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                })}
              />
              <Tooltip
                cursor={{ fill: chart.color('bg.muted') }}
                animationDuration={0}
                content={<Chart.Tooltip />}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="top"
                wrapperStyle={{ paddingLeft: 30 }}
                content={<Chart.Legend orientation="vertical" />}
              />
              {chart.series.map((item) => (
                <Bar
                  isAnimationActive={false}
                  key={item.name}
                  dataKey={chart.key(item.name)}
                  fill={chart.color(item.color)}
                />
              ))}
            </BarChart>
          </Chart.Root>
        </Stack>
        <Stack>
          <Text fontWeight="bold">
            TSYS capture auto hold rules effectiveness for Merchant count 4663
          </Text>
          <Chart.Root maxH="sm" chart={chart}>
            <BarChart data={chart.data}>
              <CartesianGrid
                stroke={chart.color('border.muted')}
                vertical={false}
              />
              <XAxis
                axisLine={false}
                tickLine={false}
                dataKey={chart.key('month')}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={chart.formatNumber({
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                })}
              />
              <Tooltip
                cursor={{ fill: chart.color('bg.muted') }}
                animationDuration={0}
                content={<Chart.Tooltip />}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="top"
                wrapperStyle={{ paddingLeft: 30 }}
                content={<Chart.Legend orientation="vertical" />}
              />
              {chart.series.map((item) => (
                <Bar
                  isAnimationActive={false}
                  key={item.name}
                  dataKey={chart.key(item.name)}
                  fill={chart.color(item.color)}
                />
              ))}
            </BarChart>
          </Chart.Root>
        </Stack>
      </SimpleGrid>
      <Flex>
        {data && data?.data.length > 0 ? (
          <Flex gap={2} w="full">
            <DataTable
              isLoading={isLoading}
              data={data}
              columns={columnsBoards}
              enablePagination
              pagination={{ pageIndex, pageSize }}
              onSetPagination={setPagination}
              initialItemsPerPage={initialItemsPerPage}
            />
          </Flex>
        ) : (
          isError && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>
                  Error found. Try again later.
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )
        )}
        <Toaster />
      </Flex>
    </Flex>
  );
}
