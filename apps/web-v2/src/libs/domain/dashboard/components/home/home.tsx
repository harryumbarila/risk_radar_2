'use client';
import React from 'react';
import { Box, VStack, SimpleGrid, Grid, HStack, Text } from '@chakra-ui/react';
import {
  MdAttachMoney,
  MdPerson,
  MdPersonAdd,
  MdShoppingCart,
} from 'react-icons/md';
import {
  CustomAreaChart,
  CustomBarChart,
  CustomDonutChart,
  CustomSparkline,
  StatCard,
} from '@/ui/components/common/atoms';
import CustomTable from '../transactions/transactions';

export default function Home() {
  const projects = [
    {
      name: 'Purity UI Version',
      members: 5,
      budget: '$14,000',
      completion: 60,
      color: '#805AD5',
    },
    {
      name: 'Add Progress Track',
      members: 2,
      budget: '$3,000',
      completion: 10,
      color: '#3182CE',
    },
    {
      name: 'Fix Platform Errors',
      members: 1,
      budget: '$0',
      completion: 100,
      color: '#E53E3E',
    },
  ];

  const orders = [
    {
      title: '$2400, Design changes',
      time: '22 DEC 7:20 PM',
      icon: '🔔',
      color: '#22C55E',
    },
    {
      title: 'New order #4219423',
      time: '21 DEC 11:21 PM',
      icon: '🛒',
      color: '#EAB308',
    },
    {
      title: 'Server Payments for April',
      time: '21 DEC 9:28 PM',
      icon: '🛒',
      color: '#3B82F6',
    },
  ];

  return (
    <Box>
      <VStack gap={6} align="stretch">
        {/* Stats Row */}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={6}>
          <StatCard
            label="Today's Money"
            value="$53,000"
            change="+55%"
            icon={<MdAttachMoney size={24} color="white" />}
          />
          <StatCard
            label="Today's Users"
            value="2,300"
            change="+5%"
            icon={<MdPerson size={24} color="white" />}
          />
          <StatCard
            label="New Clients"
            value="+3,020"
            change="+14%"
            icon={<MdPersonAdd size={24} color="white" />}
          />
          <StatCard
            label="Total Sales"
            value="$173,000"
            change="+8%"
            icon={<MdShoppingCart size={24} color="white" />}
          />
        </SimpleGrid>

        {/* Featured Cards Row */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          {/* Chakra Card */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <VStack align="start" gap={3}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                title
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                UI Dashboard
              </Text>
              <Text fontSize="sm" color="gray.600">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Tempora nihil distinctio ea.
              </Text>
              <SimpleGrid columns={2} gap={2}>
                <CustomSparkline
                  data={[
                    { date: '2023-01', value: 145.43 },
                    { date: '2023-02', value: -151.73 },
                    { date: '2023-03', value: 157.65 },
                    { date: '2023-04', value: 169.68 },
                    { date: '2023-05', value: 173.75 },
                    { date: '2023-06', value: 186.68 },
                    { date: '2023-07', value: 181.99 },
                    { date: '2023-08', value: 189.46 },
                  ]}
                />
                <CustomSparkline
                  data={[
                    { date: '2023-01', value: 145.43 },
                    { date: '2023-02', value: 151.73 },
                    { date: '2023-03', value: 157.65 },
                    { date: '2023-04', value: 169.68 },
                    { date: '2023-05', value: 173.75 },
                    { date: '2023-06', value: 186.68 },
                    { date: '2023-07', value: 181.99 },
                    { date: '2023-08', value: -189.46 },
                  ]}
                />
                <CustomSparkline
                  data={[
                    { date: '2023-01', value: -145.43 },
                    { date: '2023-02', value: 151.73 },
                    { date: '2023-03', value: -157.65 },
                    { date: '2023-04', value: 169.68 },
                    { date: '2023-05', value: 173.75 },
                    { date: '2023-06', value: 186.68 },
                    { date: '2023-07', value: -181.99 },
                    { date: '2023-08', value: 189.46 },
                  ]}
                />
                <CustomSparkline
                  data={[
                    { date: '2023-01', value: 145.43 },
                    { date: '2023-02', value: 151.73 },
                    { date: '2023-03', value: 157.65 },
                    { date: '2023-04', value: 169.68 },
                    { date: '2023-05', value: 173.75 },
                    { date: '2023-06', value: 186.68 },
                    { date: '2023-07', value: 181.99 },
                    { date: '2023-08', value: 189.46 },
                  ]}
                />
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Work Card */}
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            position="relative"
            overflow="hidden"
            h="430px"
          >
            <Text fontSize="xl" fontWeight="bold">
              UI Dashboard
            </Text>
            <CustomAreaChart />
          </Box>
        </SimpleGrid>

        {/* Charts Row */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1.5fr' }} gap={6}>
          {/* Active Users */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <VStack align="start" gap={4} mb={4}>
              <Text fontSize="sm" fontWeight="bold">
                Active Users
              </Text>
              <CustomDonutChart />
              <HStack>
                <Text fontSize="sm" fontWeight="bold" color="green.500">
                  +23%
                </Text>
                <Text fontSize="sm" color="gray.500">
                  than last week
                </Text>
              </HStack>
            </VStack>
            {/* <BarChart /> */}

            {/* Metrics */}
            <SimpleGrid columns={4} gap={4} mt={6}>
              <VStack align="start" gap={1}>
                <HStack gap={2}>
                  <Box w="8px" h="8px" bg="brand.400" borderRadius="full" />
                  <Text fontSize="xs" color="gray.500">
                    Users
                  </Text>
                </HStack>
                <Text fontWeight="bold">32,984</Text>
              </VStack>
              <VStack align="start" gap={1}>
                <HStack gap={2}>
                  <Box w="8px" h="8px" bg="#2C7A7B" borderRadius="full" />
                  <Text fontSize="xs" color="gray.500">
                    Clicks
                  </Text>
                </HStack>
                <Text fontWeight="bold">2.42m</Text>
              </VStack>
              <VStack align="start" gap={1}>
                <HStack gap={2}>
                  <Box w="8px" h="8px" bg="#319795" borderRadius="full" />
                  <Text fontSize="xs" color="gray.500">
                    Sales
                  </Text>
                </HStack>
                <Text fontWeight="bold">2,400$</Text>
              </VStack>
              <VStack align="start" gap={1}>
                <HStack gap={2}>
                  <Box w="8px" h="8px" bg="#38B2AC" borderRadius="full" />
                  <Text fontSize="xs" color="gray.500">
                    Items
                  </Text>
                </HStack>
                <Text fontWeight="bold">320</Text>
              </VStack>
            </SimpleGrid>
          </Box>

          {/* Sales Overview */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <VStack align="start" gap={4} mb={4}>
              <Text fontSize="sm" fontWeight="bold">
                Sales Overview
              </Text>
              <CustomBarChart />
              <HStack>
                <Text fontSize="sm" fontWeight="bold" color="green.500">
                  5% more
                </Text>
                <Text fontSize="sm" color="gray.500">
                  in 2021
                </Text>
              </HStack>
            </VStack>
            {/* <LineChart /> */}
          </Box>
        </Grid>

        {/* Projects and Orders Row */}
        <Grid templateColumns={{ base: '1fr', lg: '1.5fr 1fr' }} gap={6}>
          {/* Projects Table */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <VStack align="start" gap={4} mb={6}>
              <Text fontSize="sm" fontWeight="bold">
                Projects
              </Text>
              <HStack>
                <Box w="8px" h="8px" bg="brand.400" borderRadius="full" />
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  30 done
                </Text>
                <Text fontSize="xs" color="gray.400">
                  this month
                </Text>
              </HStack>
            </VStack>

            <VStack align="stretch" gap={4}>
              {/* Table Header */}
              <Grid
                templateColumns="2fr 1fr 1fr 1fr"
                gap={4}
                pb={2}
                borderBottom="1px"
                borderColor="gray.100"
              >
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  COMPANIES
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  MEMBERS
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  BUDGET
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  COMPLETION
                </Text>
              </Grid>

              {/* Table Rows */}
              {projects.map((project, idx) => (
                <Grid
                  key={idx}
                  templateColumns="2fr 1fr 1fr 1fr"
                  gap={4}
                  alignItems="center"
                >
                  <HStack gap={2}>
                    <Box
                      w="30px"
                      h="30px"
                      bg={project.color}
                      borderRadius="md"
                    />
                    <Text fontSize="sm" fontWeight="medium">
                      {project.name}
                    </Text>
                  </HStack>
                  <HStack gap={-2}>
                    {[...Array(Math.min(project.members, 3))].map((_, i) => (
                      <Box
                        key={i}
                        w="32px"
                        h="32px"
                        borderRadius="full"
                        bg="gray.300"
                        border="2px solid white"
                      />
                    ))}
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold">
                    {project.budget}
                  </Text>
                  <VStack align="start" gap={1}>
                    <Text fontSize="xs" color="brand.400" fontWeight="bold">
                      {project.completion}%
                    </Text>
                    <Box
                      w="full"
                      bg="gray.200"
                      h="6px"
                      borderRadius="full"
                      overflow="hidden"
                    >
                      <Box
                        w={`${project.completion}%`}
                        h="full"
                        bg="brand.400"
                        transition="width 0.3s"
                      />
                    </Box>
                  </VStack>
                </Grid>
              ))}
            </VStack>
          </Box>

          {/* Orders Overview */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <VStack align="start" gap={4} mb={6}>
              <Text fontSize="sm" fontWeight="bold">
                Orders Overview
              </Text>
              <HStack>
                <Text fontSize="sm" fontWeight="bold" color="brand.400">
                  +30%
                </Text>
                <Text fontSize="sm" color="gray.500">
                  this month
                </Text>
              </HStack>
            </VStack>

            <VStack align="stretch" gap={6}>
              {orders.map((order, idx) => (
                <HStack key={idx} gap={4} align="start">
                  <Box
                    bg={order.color}
                    w="35px"
                    h="35px"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="lg"
                  >
                    {order.icon}
                  </Box>
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontSize="sm" fontWeight="bold">
                      {order.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {order.time}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Grid>
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <CustomTable />
        </Box>
      </VStack>
    </Box>
  );
}
