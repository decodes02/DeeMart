export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatPrice = (value) => currency.format(Number(value ?? 0));

export const formatDate = (value) => {
  if (!value) {
    return 'Not scheduled';
  }
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
};