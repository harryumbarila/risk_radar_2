export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function parseCurrency(value: string): number {
  return Number.parseFloat(value.replace(/,/g, ''));
}
