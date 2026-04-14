export const formatTelegramLink = (val: string) => {
  if (!val) return '';
  if (val.startsWith('http')) return val;
  const clean = val.replace('@', '').trim();
  return `https://t.me/${clean}`;
};
