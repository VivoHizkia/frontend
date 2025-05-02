export function formatCurrency(value, currency = 'USD') {
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US';

  // Jika angka memiliki desimal, gunakan presisi penuh
  if (value % 1 !== 0) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6, // Batasi hingga 6 angka desimal
    }).format(value);
  }

  // Jika angka bulat, tampilkan tanpa desimal
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0, // Tidak ada angka desimal
  }).format(value);
}
