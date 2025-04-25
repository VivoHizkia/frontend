export function formatCurrency(value, currency = 'USD') {
  const validCurrency = currency || 'USD';
  const locale = validCurrency === 'IDR' ? 'id-ID' : 'en-US';

  let amount = 0;

  // Jika value berupa objek { quantity, price }
  if (typeof value === 'object' && value !== null && 'quantity' in value && 'price' in value) {
    const quantity = parseFloat(value.quantity) || 0;
    const price = parseFloat(value.price) || 0;
    amount = quantity * price;
  } else {
    // Jika value adalah angka biasa
    amount = parseFloat(value) || 0;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: validCurrency,
    minimumFractionDigits: 2
  }).format(amount);
}
