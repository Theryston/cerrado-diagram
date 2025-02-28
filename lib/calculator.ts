import { AssetClass, Asset, Investment } from './types';

export function calculateInvestmentDistribution(
  assetClasses: AssetClass[],
  assets: Asset[],
  currentTotal: number,
  contributionAmount: number
): Investment[] {
  // Calculate the total score for each asset class
  const classScores = assetClasses.reduce<Record<string, number>>((acc, assetClass) => {
    acc[assetClass.id] = assetClass.score;
    return acc;
  }, {});

  // Calculate the total value invested in each asset class
  const currentClassInvestments = assets.reduce<Record<string, number>>((acc, asset) => {
    const classId = asset.classId;
    const assetValue = asset.price * asset.quantity;
    acc[classId] = (acc[classId] || 0) + assetValue;
    return acc;
  }, {});

  // Calculate the target value for each asset class based on percentage
  const targetClassInvestments = assetClasses.reduce<Record<string, number>>((acc, assetClass) => {
    acc[assetClass.id] = (currentTotal + contributionAmount) * (assetClass.percentage / 100);
    return acc;
  }, {});

  // Calculate the needed amount to reach target for each class
  const classNeeds = assetClasses.reduce<Record<string, number>>((acc, assetClass) => {
    const current = currentClassInvestments[assetClass.id] || 0;
    const target = targetClassInvestments[assetClass.id];
    acc[assetClass.id] = target - current;
    return acc;
  }, {});

  // Calculate the total score per class
  const assetScoresByClass = assets.reduce<Record<string, Record<string, number>>>((acc, asset) => {
    if (!acc[asset.classId]) {
      acc[asset.classId] = {};
    }
    acc[asset.classId][asset.id] = asset.score;
    return acc;
  }, {});

  // Calculate total score for each class
  const totalScoreByClass = Object.keys(assetScoresByClass).reduce<Record<string, number>>((acc, classId) => {
    acc[classId] = Object.values(assetScoresByClass[classId]).reduce((sum, score) => sum + score, 0);
    return acc;
  }, {});

  // Initial distribution based on scores
  const initialDistribution: Investment[] = assets.map(asset => {
    const classId = asset.classId;
    const classNeed = classNeeds[classId];
    
    // Skip if the class doesn't need more investment
    if (classNeed <= 0) {
      return {
        classId,
        assetId: asset.id,
        amount: 0,
        suggested: 0,
        actual: null
      };
    }
    
    // Calculate score proportion for this asset within its class
    const classScoreTotal = totalScoreByClass[classId] || 1;
    const scoreProportion = asset.score / classScoreTotal;
    
    // Initial suggested amount based on score
    const rawAmount = classNeed * scoreProportion;
    
    return {
      classId,
      assetId: asset.id,
      amount: rawAmount,
      suggested: 0, // Will be calculated in the next step
      actual: null
    };
  });

  // Adjust for minimum investment
  const investments = adjustForMinimumInvestment(initialDistribution, assets, contributionAmount);
  
  return investments;
}

function adjustForMinimumInvestment(
  initialDistribution: Investment[],
  assets: Asset[],
  contributionAmount: number
): Investment[] {
  const assetMap = assets.reduce<Record<string, Asset>>((acc, asset) => {
    acc[asset.id] = asset;
    return acc;
  }, {});

  // Calculate initial total
  const initialTotal = initialDistribution.reduce((sum, inv) => sum + inv.amount, 0);
  
  // Adjust distribution
  let adjustedDistribution = initialDistribution.map(inv => {
    const asset = assetMap[inv.assetId];
    const minAmount = asset.minInvestment * asset.price;
    
    if (inv.amount < minAmount && inv.amount > 0) {
      // Not enough for minimum investment
      return {
        ...inv,
        suggested: 0,
        amount: 0
      };
    } else if (inv.amount > 0) {
      // Calculate suggested units (whole number of units)
      const suggestedUnits = Math.floor(inv.amount / asset.price);
      return {
        ...inv,
        suggested: suggestedUnits * asset.price,
        amount: inv.amount
      };
    }
    
    return inv;
  });
  
  // Calculate remaining amount based on suggested values
  const suggestedTotal = adjustedDistribution.reduce((sum, inv) => sum + inv.suggested, 0);
  let remaining = contributionAmount - suggestedTotal;
  
  // Sort assets by score for optimal distribution of remaining amount
  const scoreSortedDistribution = [...adjustedDistribution]
    .filter(inv => inv.amount > 0)
    .sort((a, b) => {
      const assetA = assetMap[a.assetId];
      const assetB = assetMap[b.assetId];
      return assetB.score - assetA.score;
    });
  
  // Try to allocate remaining amount to highest score assets
  for (const inv of scoreSortedDistribution) {
    if (remaining <= 0) break;
    
    const asset = assetMap[inv.assetId];
    const unitPrice = asset.price;
    
    if (remaining >= unitPrice) {
      const additionalUnits = Math.floor(remaining / unitPrice);
      const additionalAmount = additionalUnits * unitPrice;
      
      // Find this investment in our adjusted distribution and update it
      const index = adjustedDistribution.findIndex(item => item.assetId === inv.assetId);
      if (index !== -1) {
        adjustedDistribution[index].suggested += additionalAmount;
        remaining -= additionalAmount;
      }
    }
  }
  
  return adjustedDistribution;
}