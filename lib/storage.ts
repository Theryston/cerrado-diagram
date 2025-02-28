import { CerradoDiagram, AssetClass, Asset, Investment } from './types';

const STORAGE_KEY = 'cerrado-diagram-data';

// Get data from localStorage
export function getStoredData(): CerradoDiagram | null {
  if (typeof window === 'undefined') return null;
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return null;
  
  try {
    return JSON.parse(storedData) as CerradoDiagram;
  } catch (error) {
    console.error('Error parsing stored data:', error);
    return null;
  }
}

// Save data to localStorage
export function saveData(data: CerradoDiagram): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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