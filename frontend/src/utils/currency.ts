export const formatUGX = (n: number | string | null | undefined): string => {
  const num = Number(n || 0);
  return `UGX ${num.toLocaleString('en-UG')}`;
};
