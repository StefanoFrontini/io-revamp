export const formatNumber = (num: number) =>
  new Intl.NumberFormat("it-IT").format(num);

export const formatNumberWallet = (num: number) =>
  Number((num / 1000000).toFixed(1)) % 1 !== 0
    ? (num / 1000000).toFixed(1)
    : (num / 1000000).toFixed(0);
