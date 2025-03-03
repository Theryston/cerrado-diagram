import React, { useState, useEffect } from "react";
import { Investment, Asset, AssetClass } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface InvestmentResultsProps {
  investments: Investment[];
  assets: Asset[];
  assetClasses: AssetClass[];
  onReset: () => void;
}

export function InvestmentResults({
  investments,
  assets,
  assetClasses,
  onReset,
}: InvestmentResultsProps) {
  const [actualInvestments, setActualInvestments] =
    useState<Investment[]>(investments);

  // Update local state when props change
  useEffect(() => {
    setActualInvestments(investments);
  }, [investments]);

  const getAsset = (assetId: string) => {
    return assets.find((asset) => asset.id === assetId);
  };

  const getAssetClass = (classId: string) => {
    return assetClasses.find((cls) => cls.id === classId);
  };

  // Group investments by asset class
  const investmentsByClass = actualInvestments.reduce<
    Record<string, Investment[]>
  >((acc, inv) => {
    if (!acc[inv.classId]) {
      acc[inv.classId] = [];
    }
    acc[inv.classId].push(inv);
    return acc;
  }, {});

  const hasInvestments = actualInvestments.some((inv) => inv.suggested > 0);
  const totalInvestment = actualInvestments.reduce(
    (acc, inv) => acc + inv.suggested,
    0
  );

  return (
    <Card className="w-full">
      <CardContent className="mt-6">
        {!hasInvestments ? (
          <p>
            Nenhum investimento sugerido. Verifique seus ativos e tente
            novamente.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(investmentsByClass).map(
              ([classId, investments]) => {
                const assetClass = getAssetClass(classId);
                const classInvestments = investments.filter(
                  (inv) => inv.suggested > 0
                );

                if (classInvestments.length === 0) return null;

                return (
                  <div key={classId}>
                    <h3 className="text-lg font-medium mb-2">
                      {assetClass?.name || "Classe Desconhecida"}
                    </h3>
                    <div className="space-y-2">
                      {classInvestments.map((inv) => {
                        const asset = getAsset(inv.assetId);
                        if (!asset) return null;

                        return (
                          <div
                            key={inv.assetId}
                            className="flex items-center p-3 border rounded-md"
                          >
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                              <div className="font-bold text-xl mr-4">
                                {asset.ticker}
                              </div>

                              <div className="text-sm text-gray-500">
                                <span className="font-medium text-foreground">
                                  Aporte Sugerido:
                                </span>{" "}
                                R$ {inv.suggested.toFixed(2)}
                              </div>

                              <div className="text-sm text-gray-500">
                                <span className="font-medium text-foreground">
                                  Comprar:
                                </span>{" "}
                                {inv.amount} unidades
                              </div>

                              <div className="text-sm text-gray-500">
                                <span className="font-medium text-foreground">
                                  Ideal:
                                </span>{" "}
                                {(inv.idealPercentage * 100).toFixed(2)}%
                              </div>

                              <div className="text-sm text-gray-500">
                                <span className="font-medium text-foreground">
                                  Novo Percentual:
                                </span>{" "}
                                {(inv.newPercentage * 100).toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}

            <div className="text-lg text-gray-500">
              <span className="font-medium text-foreground">
                Total a investir:
              </span>{" "}
              R$ {totalInvestment.toFixed(2)}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onReset}>
                Novo Cálculo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
