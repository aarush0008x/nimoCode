export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatTimeMs = (ms?: number): string => {
  if (!ms) return 'N/A';
  return `${ms} ms`;
};

export const formatMemoryMb = (mb?: number): string => {
  if (!mb) return 'N/A';
  return `${mb} MB`;
};
