import { AssetClass, Asset, Investment } from "./types";

export function calculateInvestmentDistribution(
  assetClasses: AssetClass[],
  assets: Asset[],
  currentTotal: number,
  contributionAmount: number
): Investment[] {
  // Novo total da carteira após o aporte
  const newTotal = currentTotal + contributionAmount;

  // ETAPA 1: Calcular percentuais ideais para cada ativo
  const assetsWithDetails = [];

  for (const assetClass of assetClasses) {
    const assetsInClass = assets.filter(
      (asset) => asset.classId === assetClass.id
    );
    const totalScore = assetsInClass.reduce(
      (sum, asset) => sum + asset.score,
      0
    );

    for (const asset of assetsInClass) {
      // Peso relativo na classe baseado na nota
      const weight = asset.score / totalScore;
      // Percentual ideal na carteira total
      const idealPercentage = (weight * assetClass.percentage) / 100;

      // Valores atuais
      const currentValue = asset.price * asset.quantity;
      const currentPercentage = currentValue / currentTotal;

      // Valor ideal após aporte
      const idealValue = newTotal * idealPercentage;

      // Diferença entre ideal e atual
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

  // ETAPA 2: Ordenar ativos por prioridade (maior diferença percentual primeiro)
  assetsWithDetails.sort(
    (a, b) => b.percentageDifference - a.percentageDifference
  );

  // ETAPA 3: Inicializar plano de alocação
  const allocations = assetsWithDetails.map((item) => ({
    asset: item.asset,
    idealPercentage: item.idealPercentage,
    currentValue: item.currentValue,
    amountToInvest: 0,
    unitsToInvest: 0,
  }));

  // ETAPA 4: Distribuir o aporte
  let remainingAmount = contributionAmount;

  // Primeira passagem: alocar para ativos que precisam de mais investimento
  for (let i = 0; i < assetsWithDetails.length && remainingAmount > 0; i++) {
    const item = assetsWithDetails[i];
    const allocation = allocations[i];

    // Pular ativos que não precisam de mais investimento
    if (item.valueDifference <= 0) continue;

    const minimumInvestment = item.asset.price * item.asset.minInvestment;

    // Verificar se podemos comprar pelo menos o mínimo
    if (minimumInvestment <= remainingAmount) {
      // Quanto podemos investir (limitado pela necessidade e pelo valor disponível)
      const maxAmount = Math.min(item.valueDifference, remainingAmount);

      // Calcular quantas unidades podemos comprar
      const maxUnits = Math.floor(maxAmount / item.asset.price);

      // Ajustar para respeitar o mínimo de investimento
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

  // Segunda passagem: distribuir o valor restante
  while (remainingAmount > 0) {
    let allocated = false;

    // Tentar alocar primeiro para os ativos mais prioritários
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

    if (!allocated) break; // Não foi possível alocar mais
  }

  // ETAPA 5: Preparar o resultado final
  return allocations.map((allocation) => {
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
  });
}
