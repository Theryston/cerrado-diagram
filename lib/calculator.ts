import { AssetClass, Asset, Investment } from "./types";

export function calculateInvestmentDistribution(
  assetClasses: AssetClass[],
  assets: Asset[],
  currentTotal: number,
  contributionAmount: number
): Investment[] {
  const idealPercentageDistribution = assetClasses.map((assetClass) => {
    const assetsInClass = assets.filter(
      (asset) => asset.classId === assetClass.id
    );
    const totalScore = assetsInClass.reduce(
      (sum, asset) => sum + asset.score,
      0
    );

    return {
      ...assetClass,
      assets: assetsInClass.map((asset) => {
        return {
          ...asset,
          percentage:
            ((asset.score / totalScore) * assetClass.percentage) / 100,
        };
      }),
    };
  });

  const newTotal = currentTotal + contributionAmount;
  let missingAmount = 0;

  let newAssetValeuBasedInPercentage = assetClasses
    .map((assetClass) => {
      const assetsInClass = assets.filter(
        (asset) => asset.classId === assetClass.id
      );
      const idealPercentageDistributionClass = idealPercentageDistribution.find(
        (idealAssetClass) => idealAssetClass.id === assetClass.id
      );
      const idealPercentageDistributionAssets =
        idealPercentageDistributionClass?.assets;

      return {
        ...assetClass,
        assets: assetsInClass.map((asset) => {
          const idealAsset = idealPercentageDistributionAssets?.find(
            (idealAsset) => idealAsset.id === asset.id
          );

          if (!idealAsset) {
            return undefined;
          }

          console.log(
            "idealAsset",
            idealAsset.ticker,
            "idealAsset.percentage",
            idealAsset.percentage
          );

          const suggestedTotalToBuy = newTotal * idealAsset.percentage;
          const currentTotal = asset.price * asset.quantity;
          let difference = suggestedTotalToBuy - currentTotal;

          if (difference < 0) {
            missingAmount += difference * -1;
            difference = 0;
          }

          return {
            ...asset,
            suggestedTotalToBuy,
            currentTotal,
            difference,
            idealPercentage: idealAsset.percentage,
          };
        }),
      };
    })
    .filter((assetClass) => assetClass !== undefined)
    .map((assetClass) => {
      return {
        ...assetClass,
        assets: assetClass.assets.filter((asset) => asset !== undefined),
      };
    });

  newAssetValeuBasedInPercentage = newAssetValeuBasedInPercentage.map(
    (assetClass) => {
      return {
        ...assetClass,
        assets: assetClass.assets.map((asset) => {
          const minimumAmountToBuy = asset.price * asset.minInvestment;
          if (
            asset.suggestedTotalToBuy < minimumAmountToBuy &&
            asset.suggestedTotalToBuy !== 0
          ) {
            const missingAmountToBuy = asset.difference / minimumAmountToBuy;

            if (missingAmount >= missingAmountToBuy) {
              missingAmount -= missingAmountToBuy;
              asset.suggestedTotalToBuy = asset.price * asset.minInvestment;
            }
          }

          const isDivisible =
            asset.suggestedTotalToBuy % minimumAmountToBuy === 0;

          if (!isDivisible) {
            const missingAmountToBeDivisible =
              minimumAmountToBuy -
              (asset.suggestedTotalToBuy % minimumAmountToBuy);

            if (missingAmount >= missingAmountToBeDivisible) {
              missingAmount -= missingAmountToBeDivisible;
              asset.suggestedTotalToBuy = asset.price * asset.minInvestment;
            } else {
              const suggestedQuantity = Math.floor(
                asset.suggestedTotalToBuy / minimumAmountToBuy
              );

              const newSuggestedTotal = suggestedQuantity * minimumAmountToBuy;

              missingAmount += asset.suggestedTotalToBuy - newSuggestedTotal;
              asset.suggestedTotalToBuy = newSuggestedTotal;
            }
          }

          return { ...asset };
        }),
      };
    }
  );

  const newAssets = newAssetValeuBasedInPercentage.flatMap(
    (assetClass) => assetClass.assets
  );

  return newAssets.map((asset) => {
    const newPercentage =
      (asset.suggestedTotalToBuy + asset.price * asset.quantity) / newTotal;

    return {
      suggested: asset.suggestedTotalToBuy,
      amount: asset.suggestedTotalToBuy / asset.price,
      actual: null,
      newPercentage: newPercentage,
      classId: asset.classId,
      assetId: asset.id,
      idealPercentage: asset.idealPercentage,
    };
  });
}
