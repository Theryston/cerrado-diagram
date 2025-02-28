import React, { useState, useEffect } from "react";
import { Asset, AssetClass } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchAssetPrice } from "@/lib/api";

interface AssetFormProps {
  assets: Asset[];
  assetClasses: AssetClass[];
  onSave: (assets: Asset[]) => void;
}

export function AssetForm({ assets, assetClasses, onSave }: AssetFormProps) {
  const [currentAssets, setCurrentAssets] = useState<Asset[]>(assets);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [classId, setClassId] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update currentAssets when assets props changes
  useEffect(() => {
    setCurrentAssets(assets);
  }, [assets]);

  const handleAddAsset = async () => {
    // Validate inputs
    if (!ticker.trim()) {
      setError("Ticker é obrigatório");
      return;
    }

    if (!classId) {
      setError("Selecione uma classe de ativos");
      return;
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantidade precisa ser um número positivo");
      return;
    }

    const parsedScore = parseInt(score);
    if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 10) {
      setError("Nota precisa ser um número inteiro entre 1 e 10");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch asset price
      const { price, minInvestment } = await fetchAssetPrice(
        ticker.toUpperCase()
      );

      // Create new asset
      const newAsset: Asset = {
        id: Date.now().toString(),
        ticker: ticker.toUpperCase(),
        classId,
        quantity: parsedQuantity,
        price,
        minInvestment,
        score: parsedScore,
      };

      const updatedAssets = [...currentAssets, newAsset];
      setCurrentAssets(updatedAssets);

      // Clear inputs
      setTicker("");
      setQuantity("");
      setClassId("");
      setScore("");

      // Save to parent component
      onSave(updatedAssets);
    } catch (err) {
      setError(
        "Erro ao buscar informações do ativo. Verifique o ticker e tente novamente."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAsset = (id: string) => {
    const updatedAssets = currentAssets.filter((asset) => asset.id !== id);
    setCurrentAssets(updatedAssets);
    onSave(updatedAssets);
  };

  const handleUpdateAsset = (id: string, field: keyof Asset, value: string) => {
    const updatedAssets = currentAssets.map((asset) => {
      if (asset.id === id) {
        if (field === "ticker") {
          return { ...asset, ticker: value.toUpperCase() };
        } else if (field === "quantity") {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue)) {
            return { ...asset, quantity: parsedValue };
          }
        } else if (field === "classId") {
          return { ...asset, classId: value };
        } else if (field === "score") {
          const parsedValue = parseInt(value);
          if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 10) {
            return { ...asset, score: parsedValue };
          }
        } else if (field === "price") {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue) && parsedValue > 0) {
            return { ...asset, price: parsedValue };
          }
        } else if (field === "minInvestment") {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue) && parsedValue >= 0) {
            return { ...asset, minInvestment: parsedValue };
          }
        }
      }
      return asset;
    });

    setCurrentAssets(updatedAssets);
    onSave(updatedAssets);
  };

  const getAssetClassName = (classId: string) => {
    const assetClass = assetClasses.find((cls) => cls.id === classId);
    return assetClass ? assetClass.name : "Desconhecido";
  };

  const getScoreClass = (score: number) => {
    if (score >= 7) return "score-high";
    if (score >= 4) return "score-medium";
    return "score-low";
  };

  // Group assets by class
  const assetsByClass = currentAssets.reduce<Record<string, Asset[]>>(
    (acc, asset) => {
      const classId = asset.classId;
      if (!acc[classId]) {
        acc[classId] = [];
      }
      acc[classId].push(asset);
      return acc;
    },
    {}
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {Object.entries(assetsByClass).map(([classId, classAssets]) => (
          <div key={classId} className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {getAssetClassName(classId)}
            </h3>
            <div className="space-y-2">
              {classAssets.map((asset) => (
                <div
                  key={asset.id}
                  className={`flex items-center space-x-2 p-3 border rounded-md ${getScoreClass(
                    asset.score
                  )}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={asset.ticker}
                        onChange={(e) =>
                          handleUpdateAsset(asset.id, "ticker", e.target.value)
                        }
                        className="w-24"
                        placeholder="Ticker"
                      />
                      <Input
                        type="number"
                        value={asset.quantity}
                        onChange={(e) =>
                          handleUpdateAsset(
                            asset.id,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-24"
                        placeholder="Qtd"
                      />
                      <select
                        value={asset.classId}
                        onChange={(e) =>
                          handleUpdateAsset(asset.id, "classId", e.target.value)
                        }
                        className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Selecione uma classe</option>
                        {assetClasses.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                      <div className="flex-1 flex items-center justify-end space-x-2">
                        <Input
                          type="number"
                          value={asset.score}
                          onChange={(e) =>
                            handleUpdateAsset(asset.id, "score", e.target.value)
                          }
                          className="w-20"
                          placeholder="Nota"
                          min="1"
                          max="10"
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">R$</span>
                          <Input
                            type="number"
                            value={asset.price}
                            onChange={(e) => {
                              const newPrice = parseFloat(e.target.value);
                              if (!isNaN(newPrice) && newPrice > 0) {
                                handleUpdateAsset(asset.id, "price", e.target.value);
                              }
                            }}
                            className="w-24"
                            step="0.01"
                            min="0.01"
                            placeholder="Preço"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveAsset(asset.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col space-y-4 mt-6">
          <div>
            <Label htmlFor="ticker">Ticker</Label>
            <Input
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Ex: PETR4"
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ex: 10"
            />
          </div>

          <div>
            <Label htmlFor="assetClass">Classe de Ativo</Label>
            <select
              id="assetClass"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione uma classe</option>
              {assetClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="score">Nota de Risco (1-10)</Label>
            <Input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Ex: 8"
              min="1"
              max="10"
            />
          </div>

          <Button onClick={handleAddAsset} disabled={loading}>
            {loading ? "Buscando dados..." : "Adicionar Ativo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
