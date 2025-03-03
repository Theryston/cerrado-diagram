import { AssetClass, Asset, Investment } from "./types";

export function calculateInvestmentDistribution(
  assetClasses: AssetClass[],
  assets: Asset[],
  currentTotal: number,
  contributionAmount: number
): Investment[] {
  console.log("assetClasses", assetClasses);
  console.log("assets", assets);
  console.log("currentTotal", currentTotal);
  console.log("contributionAmount", contributionAmount);
  return [];
}
