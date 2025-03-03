import { CerradoDiagram, AssetClass, Asset, Investment } from "./types";

const STORAGE_KEY = "cerrado-diagram-data";

// Get data from localStorage
export function getStoredData(): CerradoDiagram | null {
  if (typeof window === "undefined") return null;

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;

    const parsedData = JSON.parse(storedData) as CerradoDiagram;

    // Ensure all properties exist with proper defaults
    return {
      assetClasses: Array.isArray(parsedData.assetClasses)
        ? parsedData.assetClasses
        : [],
      assets: Array.isArray(parsedData.assets) ? parsedData.assets : [],
      investments: Array.isArray(parsedData.investments)
        ? parsedData.investments
        : [],
      totalInvestment:
        typeof parsedData.totalInvestment === "number"
          ? parsedData.totalInvestment
          : 0,
      contributionAmount:
        typeof parsedData.contributionAmount === "number"
          ? parsedData.contributionAmount
          : 0,
    };
  } catch (error) {
    console.error("Error parsing stored data:", error);
    return null;
  }
}

// Save data to localStorage
export function saveData(data: CerradoDiagram): void {
  if (typeof window === "undefined") return;

  try {
    // Ensure all required properties exist
    const sanitizedData: CerradoDiagram = {
      assetClasses: Array.isArray(data.assetClasses) ? data.assetClasses : [],
      assets: Array.isArray(data.assets) ? data.assets : [],
      investments: Array.isArray(data.investments) ? data.investments : [],
      totalInvestment:
        typeof data.totalInvestment === "number" ? data.totalInvestment : 0,
      contributionAmount:
        typeof data.contributionAmount === "number"
          ? data.contributionAmount
          : 0,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedData));
    console.log("Data saved to localStorage:", sanitizedData);
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
}

// Initialize or get stored data
export function initializeData(): CerradoDiagram {
  const storedData = getStoredData();

  if (storedData) {
    return storedData;
  }

  const initialData: CerradoDiagram = {
    assetClasses: [],
    assets: [],
    investments: [],
    totalInvestment: 0,
    contributionAmount: 0,
  };

  saveData(initialData);
  return initialData;
}

// Update asset classes
export function updateAssetClasses(assetClasses: AssetClass[]): CerradoDiagram {
  const data = getStoredData() || initializeData();
  data.assetClasses = assetClasses;
  saveData(data);
  return data;
}

// Update assets
export function updateAssets(assets: Asset[]): CerradoDiagram {
  const data = getStoredData() || initializeData();
  data.assets = assets;
  saveData(data);
  return data;
}

// Update contribution amount
export function updateContributionAmount(amount: number): CerradoDiagram {
  const data = getStoredData() || initializeData();
  data.contributionAmount = amount;
  saveData(data);
  return data;
}

// Update investments
export function updateInvestments(investments: Investment[]): CerradoDiagram {
  const data = getStoredData() || initializeData();
  data.investments = investments;
  saveData(data);
  return data;
}

// Update total investment
export function updateTotalInvestment(total: number): CerradoDiagram {
  const data = getStoredData() || initializeData();
  data.totalInvestment = total;
  saveData(data);
  return data;
}

// Reset all data
export function resetData(): CerradoDiagram {
  const initialData: CerradoDiagram = {
    assetClasses: [],
    assets: [],
    investments: [],
    totalInvestment: 0,
    contributionAmount: 0,
  };

  saveData(initialData);
  return initialData;
}
