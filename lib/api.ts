export const fetchAssetPrice = async (ticker: string) => {
  try {
    const response = await fetch(`/api/quote?ticker=${ticker}`);

    if (!response.ok) {
      throw new Error("Failed to fetch asset price");
    }

    const data = await response.json();

    return data;
  } catch {
    return { price: 0, minInvestment: getMinInvestment(ticker) };
  }
};

export const saveWalletData = async (code: string, data: string) => {
  if (!code || !data) {
    return;
  }

  const response = await fetch(`/api/wallet`, {
    method: "POST",
    body: JSON.stringify({ code, data }),
  });

  if (!response.ok) {
    throw new Error("Failed to save wallet data");
  }

  return response.json();
};

export const getWalletData = async (code: string) => {
  const response = await fetch(`/api/wallet?code=${code}`);

  if (!response.ok) {
    throw new Error("Failed to get wallet data");
  }

  return response.json();
};

export function getMinInvestment(ticker: string): number {
  const cleanTicker = ticker.split(".")[0];

  if (/\d{2}$/.test(cleanTicker)) {
    return 1;
  }

  if (/^(LFT|LTN|NTN)/.test(cleanTicker)) {
    return 1;
  }

  return 1;
}
