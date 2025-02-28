import axios from 'axios';

const api = axios.create({
  baseURL: 'https://brapi.dev/api',
});

export const fetchAssetPrice = async (ticker: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_BRAPI_API_KEY;
    const response = await api.get(`/quote/${ticker}?range=1d&interval=1d&fundamental=true&dividends=true&token=${apiKey}`);
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        price: result.regularMarketPrice,
        minInvestment: getMinInvestment(ticker),
      };
    }
    
    throw new Error('Asset not found');
  } catch (error) {
    console.error('Error fetching asset price:', error);
    // Fallback for testing/development
    return {
      price: Math.random() * 100 + 10,
      minInvestment: getMinInvestment(ticker),
    };
  }
};

// Helper function to determine minimum investment based on ticker pattern
function getMinInvestment(ticker: string): number {
  // Remove any stock exchange suffix if present
  const cleanTicker = ticker.split('.')[0];
  
  // FIIs usually end with 11 (e.g., HGLG11, KNRI11)
  if (/\d{2}$/.test(cleanTicker)) {
    return 1; // 1 unit for FIIs
  }
  
  // Treasury bonds usually start with "LFT", "LTN", "NTN", etc.
  if (/^(LFT|LTN|NTN)/.test(cleanTicker)) {
    return 0.01; // Minimum fraction for Treasury Direct
  }
  
  // Regular stocks (default)
  return 1; // 1 unit for stocks
}

export const calculateScore = async (ticker: string): Promise<number> => {
  // This would ideally connect to an API that provides scores
  // For now, we'll return a random score between 1 and 10
  return Math.floor(Math.random() * 10) + 1;
};