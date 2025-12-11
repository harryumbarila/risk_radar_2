'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Badge, SimpleGrid, Tooltip, Portal } from '@chakra-ui/react';
import { MapPin, Building2, DollarSign, Calendar, CreditCard, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface DemographicsTabProps {
  merchantId: string;
  merchantName: string;
}

// MCC definitions mapping
const getMCCDefinition = (mcc: string): string => {
  const mccDefinitions: Record<string, string> = {
    '5655': 'Clothing Stores',
    '5411': 'Grocery Stores, Supermarkets',
    '5812': 'Eating Places, Restaurants',
    '5999': 'Miscellaneous and Specialty Retail Stores',
    '5311': 'Department Stores',
    '5541': 'Service Stations (with or without ancillary services)',
    '5734': 'Computer Software Stores',
    '5814': 'Fast Food Restaurants',
    '5942': 'Book Stores',
    '5970': 'Arts and Crafts Stores',
    '5995': 'Pet Shops, Pet Food, and Supplies Stores',
    '7230': 'Beauty and Barber Shops',
    '7299': 'Miscellaneous Personal Services',
    '7372': 'Computer Programming, Data Processing, and Integrated Systems Design Services',
    '7399': 'Business Services, Not Elsewhere Classified',
    '7512': 'Automobile Rental Agency',
    '7519': 'Motor Home and Recreational Vehicle Rental',
    '7531': 'Automotive Body Repair and Paint Shops',
    '7534': 'Tire Retreading and Repair Shops',
    '7535': 'Automotive Paint Shops',
    '7538': 'Automotive Service Shops (Non-Dealer)',
    '7542': 'Car Washes',
    '7549': 'Towing Services',
    '7622': 'Radio Repair Shops',
    '7623': 'Air Conditioning and Refrigeration Repair Shops',
    '7629': 'Electrical and Small Appliance Repair Shops',
    '7631': 'Watch, Clock, and Jewelry Repair',
    '7641': 'Furniture Repair, Refinishing, and Reupholstery',
    '7692': 'Welding Repair',
    '7699': 'Miscellaneous Repair Shops and Related Services',
    '7832': 'Motion Picture Theaters',
    '7841': 'Video Tape Rental Stores',
    '7911': 'Dance Halls, Studios, and Schools',
    '7922': 'Theatrical Ticket Agencies',
    '7929': 'Bands, Orchestras, and Miscellaneous Entertainers',
    '7932': 'Billiard and Pool Establishments',
    '7933': 'Bowling Alleys',
    '7941': 'Commercial Sports, Athletic Fields, Recreation Facilities, and Public Golf Courses',
    '7991': 'Tourist Attractions and Exhibits',
    '7992': 'Public Golf Courses',
    '7993': 'Video Amusement Game Supplies',
    '7994': 'Video Game Arcades',
    '7995': 'Betting, Including Lottery Tickets, Casino Gaming Chips, Off-Track Betting, and Wagers',
    '7996': 'Amusement Parks, Circuses, Carnivals, and Fortune Tellers',
    '7997': 'Membership Clubs (Sports, Recreation, Athletic), Country Clubs, and Private Golf Courses',
    '7998': 'Aquariums, Seaquariums, Dolphinariums',
    '7999': 'Recreation Services, Not Elsewhere Classified',
    '8011': 'Doctors',
    '8021': 'Dentists and Orthodontists',
    '8031': 'Osteopathic Physicians',
    '8041': 'Chiropractors',
    '8042': 'Optometrists and Ophthalmologists',
    '8043': 'Opticians, Opticians Goods and Eyeglasses',
    '8049': 'Podiatrists and Chiropodists',
    '8050': 'Nursing and Personal Care Facilities',
    '8062': 'Hospitals',
    '8071': 'Medical and Dental Laboratories',
    '8099': 'Medical Services and Health Practitioners, Not Elsewhere Classified',
    '8111': 'Legal Services and Attorneys',
    '8211': 'Elementary and Secondary Schools',
    '8220': 'Colleges, Universities, Professional Schools, and Junior Colleges',
    '8241': 'Correspondence Schools',
    '8244': 'Business and Secretarial Schools',
    '8249': 'Vocational and Trade Schools',
    '8299': 'Schools and Educational Services, Not Elsewhere Classified',
    '8351': 'Child Care Services',
    '8398': 'Charitable and Social Service Organizations',
    '8641': 'Civic, Social, and Fraternal Associations',
    '8651': 'Political Organizations',
    '8661': 'Religious Organizations',
    '8675': 'Automobile Associations',
    '8699': 'Membership Organizations, Not Elsewhere Classified',
    '8734': 'Testing Laboratories (Non-Medical)',
    '8911': 'Architectural, Engineering, and Surveying Services',
    '8931': 'Accounting, Auditing, and Bookkeeping Services',
    '8999': 'Professional Services, Not Elsewhere Classified',
    '9211': 'Court Costs, Including Alimony and Child Support',
    '9222': 'Fines',
    '9223': 'Bail and Bond Payments',
    '9311': 'Tax Payments',
    '9399': 'Government Services, Not Elsewhere Classified',
    '9402': 'Postal Services - Government Only',
    '9405': 'Intra-Government Purchases - Government Only',
    '9700': 'Visa Credential Service',
    '9701': 'Visa T&E E-Commerce Transaction',
    '9702': 'GCAS Emergency Services',
    '9751': 'UK Supermarkets, Electronic',
    '9752': 'UK Petrol Stations',
    '9950': 'Intra-Company Purchases',
  };
  
  return mccDefinitions[mcc] || `MCC ${mcc} - Merchant Category Code`;
};

export default function DemographicsTab({ merchantId, merchantName }: DemographicsTabProps) {
  // Use merchantName (which should be dbaName) as the dbaName
  // merchantName prop is actually passed as dbaName from batch-detail-page
  const demographicsData = {
    dbaName: merchantName || 'Unknown Merchant',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    },
    activatedDate: '2024-01-15',
    netBalance: '$125,450.00',
    netBalanceChange: 12.5, // percentage change
    ownership: 'LLC',
    mcc: '5655',
    merchantType: 'E-commerce',
    cardPresent: 45.8,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isPositiveTrend = demographicsData.netBalanceChange > 0;

  return (
    <VStack align="stretch" gap={0}>
      {/* Header with DBA Name */}
      <Box
        bg="#F8F9FC"
        px={4}
        py={3}
        borderTopRadius="md"
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <HStack gap={2} align="center">
          <Box color="blue.600">
            <Building2 size={18} />
          </Box>
          <Text fontSize="lg" fontWeight="semibold" color="#111827">
            {demographicsData.dbaName}
          </Text>
        </HStack>
      </Box>

      {/* Main Content */}
      <Box
        p={4}
        bg="white"
        borderBottomRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
        borderTopWidth="0"
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          {/* Location Section */}
          <Box
            p={3}
            bg="#F8F9FC"
            borderRadius="md"
          >
            <HStack gap={2} mb={2.5} align="center">
              <Box color="#6B7280">
                <MapPin size={14} />
              </Box>
              <Text fontSize="xs" fontWeight="semibold" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                Location
              </Text>
            </HStack>
            <VStack align="start" gap={2}>
              <VStack align="start" gap={0.5}>
                <Text fontSize="sm" fontWeight="semibold" color="#111827">
                  {demographicsData.address.street}
                </Text>
                <Text fontSize="sm" color="#111827">
                  {demographicsData.address.city}, {demographicsData.address.state} {demographicsData.address.zip}
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Business Profile Section */}
          <Box
            p={3}
            bg="#F8F9FC"
            borderRadius="md"
          >
            <HStack gap={2} mb={2.5} align="center">
              <Box color="#6B7280">
                <Building2 size={14} />
              </Box>
              <Text fontSize="xs" fontWeight="semibold" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                Business Profile
              </Text>
            </HStack>
            <VStack align="start" gap={2.5}>
              <HStack gap={3} flexWrap="wrap">
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    Merchant Type
                  </Text>
                  <Badge 
                    colorPalette="blue" 
                    variant="subtle" 
                    fontSize="xs"
                    px={2.5}
                    py={1}
                    borderRadius="full"
                  >
                    {demographicsData.merchantType}
                  </Badge>
                </VStack>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    Ownership
                  </Text>
                  <Badge 
                    colorPalette="purple" 
                    variant="subtle" 
                    fontSize="xs"
                    px={2.5}
                    py={1}
                    borderRadius="full"
                  >
                    {demographicsData.ownership}
                  </Badge>
                </VStack>
              </HStack>
              <HStack gap={3} flexWrap="wrap">
                <VStack align="start" gap={0.5}>
                  <HStack gap={1} align="center">
                    <Box color="#6B7280">
                      <CreditCard size={12} />
                    </Box>
                    <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                      Card Present
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="semibold" color="#111827">
                    {demographicsData.cardPresent}%
                  </Text>
                </VStack>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    MCC
                  </Text>
                  <Tooltip.Root openDelay={300}>
                    <Tooltip.Trigger asChild>
                      <Box as="span" display="inline-flex" alignItems="center" cursor="help">
                        <Badge 
                          colorPalette="gray" 
                          variant="solid" 
                          fontSize="xs"
                          px={2.5}
                          py={1}
                          borderRadius="full"
                          fontWeight="semibold"
                        >
                          {demographicsData.mcc}
                        </Badge>
                      </Box>
                    </Tooltip.Trigger>
                    <Portal>
                      <Tooltip.Positioner>
                        <Tooltip.Content maxW="300px" zIndex={2000} bg="gray.900" color="white" px={3} py={2} borderRadius="md" fontSize="sm">
                          <Tooltip.Arrow />
                          <Text fontWeight="semibold" mb={1}>MCC {demographicsData.mcc}</Text>
                          <Text>{getMCCDefinition(demographicsData.mcc)}</Text>
                        </Tooltip.Content>
                      </Tooltip.Positioner>
                    </Portal>
                  </Tooltip.Root>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          {/* Financial Snapshot Section */}
          <Box
            p={3}
            bg="#F8F9FC"
            borderRadius="md"
          >
            <HStack gap={2} mb={2.5} align="center">
              <Box color="#6B7280">
                <DollarSign size={14} />
              </Box>
              <Text fontSize="xs" fontWeight="semibold" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                Financial Snapshot
              </Text>
            </HStack>
            <HStack gap={6} flexWrap="wrap" align="start">
              <VStack align="start" gap={0.5}>
                <HStack gap={1} align="center">
                  <Box color="#6B7280">
                    <DollarSign size={12} />
                  </Box>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    Net Balance
                  </Text>
                </HStack>
                <HStack gap={2} align="baseline">
                  <Text fontSize="lg" fontWeight="semibold" color="#111827">
                    {demographicsData.netBalance}
                  </Text>
                  <HStack gap={0.5} align="center">
                    {isPositiveTrend ? (
                      <Box color="green.600">
                        <TrendingUp size={14} />
                      </Box>
                    ) : (
                      <Box color="red.600">
                        <TrendingDown size={14} />
                      </Box>
                    )}
                    <Text 
                      fontSize="xs" 
                      fontWeight="semibold" 
                      color={isPositiveTrend ? 'green.600' : 'red.600'}
                    >
                      {Math.abs(demographicsData.netBalanceChange)}%
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
              <VStack align="start" gap={0.5}>
                <HStack gap={1} align="center">
                  <Box color="#6B7280">
                    <Calendar size={12} />
                  </Box>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    Activated Date
                  </Text>
                </HStack>
                <Text fontSize="sm" fontWeight="semibold" color="#111827">
                  {formatDate(demographicsData.activatedDate)}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
