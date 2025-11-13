'use client';
import React from 'react';
import { Box, VStack, Text, SimpleGrid } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface HourlyTransactionData {
  hour: number;
  count: number;
}

export interface ExceptionTypeData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface MiniChartsProps {
  hourlyData: HourlyTransactionData[];
  exceptionData: ExceptionTypeData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function MiniCharts({ hourlyData, exceptionData }: MiniChartsProps) {
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
      {/* Transactions by Hour - Bar Chart */}
      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <VStack align="stretch" gap={4}>
          <Text fontSize="lg" fontWeight="bold" color="gray.900">
            Transactions by Hour
          </Text>
          <Box height="250px" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Hour', position: 'insideBottom', offset: -5 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value} transactions`, 'Count']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  animationDuration={400}
                  animationEasing="ease-out"
                  label={{ position: 'top', fill: '#374151', fontSize: 12 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </Box>

      {/* Exception Types - Pie Chart */}
      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <VStack align="stretch" gap={4}>
          <Text fontSize="lg" fontWeight="bold" color="gray.900">
            Exception Types Distribution
          </Text>
          <Box height="250px" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={exceptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ''}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={400}
                  animationEasing="ease-out"
                >
                  {exceptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const total = exceptionData.reduce((sum, item) => sum + item.value, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                    return [`${value} (${percentage}%)`, name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </Box>
    </SimpleGrid>
  );
}

