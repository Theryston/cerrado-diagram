import { AssetClass, Asset, Investment } from "./types";

export function getIdealPercentage(
  asset: Asset,
  assetClass: AssetClass,
  assetsInClass: Asset[]
) {
  const totalScore = assetsInClass.reduce((sum, asset) => sum + asset.score, 0);

  const weight = asset.score / totalScore;
  const idealPercentage = (weight * assetClass.percentage) / 100;

  return idealPercentage;
}

export function calculateInvestmentDistribution(
  assetClasses: AssetClass[],
  assets: Asset[],
  currentTotal: number,
  contributionAmount: number
): Investment[] {
  const newTotal = currentTotal + contributionAmount;

  const assetsWithDetails = [];

  for (const assetClass of assetClasses) {
    const assetsInClass = assets.filter(
      (asset) => asset.classId === assetClass.id
    );

    for (const asset of assetsInClass) {
      const idealPercentage = getIdealPercentage(
        asset,
        assetClass,
        assetsInClass
      );

      const currentValue = asset.price * asset.quantity;
      const currentPercentage = currentValue / currentTotal;

      const idealValue = newTotal * idealPercentage;

      const valueDifference = idealValue - currentValue;

      assetsWithDetails.push({
        asset,
        idealPercentage,
        currentValue,
        currentPercentage,
        idealValue,
        valueDifference,
        percentageDifference: idealPercentage - currentPercentage,
      });
    }
  }

  assetsWithDetails.sort(
    (a, b) => b.percentageDifference - a.percentageDifference
  );

  const allocations = assetsWithDetails.map((item) => ({
    asset: item.asset,
    idealPercentage: item.idealPercentage,
    currentValue: item.currentValue,
    amountToInvest: 0,
    unitsToInvest: 0,
  }));

  let remainingAmount = contributionAmount;

  for (let i = 0; i < assetsWithDetails.length && remainingAmount > 0; i++) {
    const item = assetsWithDetails[i];
    const allocation = allocations[i];

    if (item.valueDifference <= 0) continue;

    const minimumInvestment = item.asset.price * item.asset.minInvestment;

    if (minimumInvestment <= remainingAmount) {
      const maxAmount = Math.min(item.valueDifference, remainingAmount);

      const maxUnits = Math.floor(maxAmount / item.asset.price);

      const unitsToInvest =
        Math.floor(maxUnits / item.asset.minInvestment) *
        item.asset.minInvestment;

      if (unitsToInvest > 0) {
        const amountToInvest = unitsToInvest * item.asset.price;

        allocation.amountToInvest = amountToInvest;
        allocation.unitsToInvest = unitsToInvest;

        remainingAmount -= amountToInvest;
      }
    }
  }

  while (remainingAmount > 0) {
    let allocated = false;

    for (let i = 0; i < allocations.length; i++) {
      const allocation = allocations[i];
      const asset = allocation.asset;
      const minimumInvestment = asset.price * asset.minInvestment;

      if (minimumInvestment <= remainingAmount) {
        allocation.amountToInvest += minimumInvestment;
        allocation.unitsToInvest += asset.minInvestment;
        remainingAmount -= minimumInvestment;
        allocated = true;
        break;
      }
    }

    if (!allocated) break;
  }

  return allocations
    .map((allocation) => {
      const newValue = allocation.currentValue + allocation.amountToInvest;
      const newPercentage = newValue / newTotal;

      return {
        classId: allocation.asset.classId,
        assetId: allocation.asset.id,
        suggested: allocation.amountToInvest,
        amount: allocation.unitsToInvest,
        actual: null,
        newPercentage,
        idealPercentage: allocation.idealPercentage,
      };
    })
    .sort((a, b) => b.suggested - a.suggested);
}
