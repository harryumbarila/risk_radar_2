export const riskColor = (score: number) => {
  if (score >= 80) return 'red';
  if (score >= 50) return 'yellow';
  return 'green';
};

export const statusColor = {
  Unreviewed: 'gray',
  'In Progress': 'yellow',
  Reviewed: 'green',
};
