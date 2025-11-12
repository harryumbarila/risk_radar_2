'use client';

import { Chart, useChart } from '@chakra-ui/charts';
import {
  Badge,
  Box,
  Card,
  FormatNumber,
  Span,
  Stack,
  Stat,
} from '@chakra-ui/react';
import { Area, AreaChart } from 'recharts';

interface CustomSparkline {
  data: { date: string; value: number }[];
}

export default function CustomSparkline(props: CustomSparkline) {
  const chart = useChart({
    data: props.data,
    series: [{ name: 'value', color: 'green.solid' }],
  });

  const closing = chart.data[chart.data.length - 1] || { date: '0', value: 0 };
  const opening = chart.data[0] || { date: '0', value: 0 };
  const trend = (closing?.value - opening?.value) / opening?.value;

  return (
    <Card.Root size="sm">
      <Card.Body flexDirection="row" alignItems="center">
        <Stack gap="0" flex="1">
          <Box fontWeight="semibold" textStyle="sm">
            AMZN
          </Box>
          <Box textStyle="xs" color="fg.muted">
            Amazon Inc.
          </Box>
        </Stack>

        <Chart.Root width="28" height="12" chart={chart}>
          <AreaChart data={chart.data}>
            <defs>
              <Chart.Gradient
                id="sp-gradient"
                stops={[
                  { offset: 0, color: 'green.solid', opacity: 0.8 },
                  { offset: 1, color: 'green.solid', opacity: 0.2 },
                ]}
              />
            </defs>
            {chart.series.map((item) => (
              <Area
                key={item.name}
                isAnimationActive={false}
                dataKey={chart.key(item.name)}
                fill={`url(#sp-gradient)`}
                fillOpacity={0.2}
                stroke={chart.color(item.color)}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </Chart.Root>

        <Stat.Root size="sm" alignItems="flex-end">
          <Span fontWeight="medium">
            <FormatNumber
              value={closing.value}
              style="currency"
              currency="USD"
            />
          </Span>
          <Badge colorPalette={trend > 0 ? 'green' : 'red'} gap="0">
            <Stat.UpIndicator />
            <FormatNumber
              value={trend}
              style="percent"
              maximumFractionDigits={2}
            />
          </Badge>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}
