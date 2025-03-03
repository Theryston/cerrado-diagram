import toast from "react-hot-toast";

export const fetchAssetPrice = async (ticker: string) => {
  try {
    const response = await fetch(`/api/quote?ticker=${ticker}`);

    if (!response.ok) {
      throw new Error("Failed to fetch asset price");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching asset price:", error);
    toast.error(
      `Erro ao buscar preço do ativo ${ticker}! Insira o valor manualmente.`
    );
    return { price: 0, minInvestment: getMinInvestment(ticker) };
  }
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
