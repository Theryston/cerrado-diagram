import React, { useState } from 'react';
import { Investment, Asset, AssetClass } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface InvestmentResultsProps {
  investments: Investment[];
  assets: Asset[];
  assetClasses: AssetClass[];
  onSaveActual: (investments: Investment[]) => void;
  onReset: () => void;
}

export function InvestmentResults({
  investments,
  assets,
  assetClasses,
  onSaveActual,
  onReset
}: InvestmentResultsProps) {
  const [actualInvestments, setActualInvestments] = useState<Investment[]>(investments);

  const getAsset = (assetId: string) => {
    return assets.find(asset => asset.id === assetId);
  };

  const getAssetClass = (classId: string) => {
    return assetClasses.find(cls => cls.id === classId);
  };

  const handleActualChange = (id: string, value: string) => {
    const parsedValue = parseFloat(value);
    
    const updatedInvestments = actualInvestments.map(inv => {
      if (inv.assetId === id) {
        return {
          ...inv,
          actual: !isNaN(parsedValue) ? parsedValue : null
        };
      }
      return inv;
    });
    
    setActualInvestments(updatedInvestments);
  };

  const handleSaveActual = () => {
    onSaveActual(actualInvestments);
  };

  // Group investments by asset class
  const investmentsByClass = actualInvestments.reduce<Record<string, Investment[]>>((acc, inv) => {
    if (!acc[inv.classId]) {
      acc[inv.classId] = [];
    }
    acc[inv.classId].push(inv);
    return acc;
  }, {});

  // Filter out investments with zero suggested amount
  const hasInvestments = actualInvestments.some(inv => inv.suggested > 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resultado do Cálculo</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasInvestments ? (
          <p>Nenhum investimento sugerido. Verifique seus ativos e tente novamente.</p>
        ) : (
          <>
            {Object.entries(investmentsByClass).map(([classId, investments]) => {
              const assetClass = getAssetClass(classId);
              const classInvestments = investments.filter(inv => inv.suggested > 0);
              
              if (classInvestments.length === 0) return null;
              
              return (
                <div key={classId} className="mb-6">
                  <h3 className="text-lg font-medium mb-2">{assetClass?.name || 'Classe Desconhecida'}</h3>
                  <div className="space-y-2">
                    {classInvestments.map(inv => {
                      const asset = getAsset(inv.assetId);
                      if (!asset) return null;
                      
                      return (
                        <div key={inv.assetId} className="flex items-center space-x-2 p-3 border rounded-md">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div className="w-20 font-medium">{asset.ticker}</div>
                              <div className="flex-1">
                                <div className="text-sm">Sugerido: R$ {inv.suggested.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">
                                  ({Math.floor(inv.suggested / asset.price)} unidades)
                                </div>
                              </div>
                              <div className="w-32">
                                <Input
                                  type="number"
                                  value={inv.actual !== null ? inv.actual : ''}
                                  onChange={(e) => handleActualChange(inv.assetId, e.target.value)}
                                  placeholder="Valor real"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            <div className="flex space-x-4 mt-6">
              <Button onClick={handleSaveActual}>Salvar Aportes Reais</Button>
              <Button variant="outline" onClick={onReset}>Novo Cálculo</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}