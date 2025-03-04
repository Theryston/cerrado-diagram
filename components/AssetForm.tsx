import React, { useState, useEffect } from "react";
import { Asset, AssetClass } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchAssetPrice } from "@/lib/api";
import { getIdealPercentage } from "@/lib/calculator";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  DEFAULT_ASSET_CLASSES_IDS,
  DEFAULT_TESOURO_TYPES,
} from "@/lib/constants";
import toast from "react-hot-toast";

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
  const [tesouroType, setTesouroType] = useState<string>("selic");
  const router = useRouter();

  useEffect(() => {
    setCurrentAssets(assets);
  }, [assets]);

  const handleAddAsset = async () => {
    const isTesouroDireto =
      classId === DEFAULT_ASSET_CLASSES_IDS.TESOURO_DIRETO;

    if (!ticker.trim() && !isTesouroDireto) {
      setError("Ticker é obrigatório");
      return;
    }

    if (isTesouroDireto && !tesouroType) {
      setError("Selecione um tipo de tesouro");
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
      const cleanTicker = isTesouroDireto
        ? tesouroType
        : ticker.toUpperCase().trim();

      let { price, minInvestment } = { price: 0, minInvestment: 0.01 };

      if (!isTesouroDireto) {
        ({ price, minInvestment } = await fetchAssetPrice(cleanTicker));
      }

      const newAsset: Asset = {
        id: Date.now().toString(),
        ticker: cleanTicker,
        classId,
        quantity: parsedQuantity,
        price,
        minInvestment,
        score: parsedScore,
      };

      if (isTesouroDireto) {
        toast.error("Insira o preço do tesouro direto manualmente");
      }

      const updatedAssets = [...currentAssets, newAsset];
      setCurrentAssets(updatedAssets);

      setTicker("");
      setTesouroType("selic");
      setQuantity("");
      setClassId("");
      setScore("");

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

  // Group assets by class
  const assetsByClass = currentAssets.reduce<
    Record<string, (Asset & { idealPercentage: number })[]>
  >((acc, asset) => {
    const classId = asset.classId;
    if (!acc[classId]) {
      acc[classId] = [];
    }

    const assetClass = assetClasses.find((cls) => cls.id === classId);
    if (!assetClass) return acc;

    const assetsInClass = currentAssets.filter((a) => a.classId === classId);

    const idealPercentage = getIdealPercentage(
      asset,
      assetClass,
      assetsInClass
    );

    acc[classId].push({ ...asset, idealPercentage });
    return acc;
  }, {});

  const totalInvestment = currentAssets.reduce(
    (acc, asset) => acc + asset.price * asset.quantity,
    0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <p className="text-sm">
          Total de ativos:{" "}
          <span className="font-bold">{currentAssets.length}</span>
        </p>
      </CardHeader>
      <CardContent>
        {Object.entries(assetsByClass).map(([classId, classAssets]) => (
          <div key={classId} className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {getAssetClassName(classId)}
            </h3>
            <div className="space-y-4">
              {classAssets.map((asset) => (
                <div
                  className="grid grid-cols-1 lg:grid-cols-7 gap-4 p-3 bg-muted rounded-md"
                  key={asset.id}
                >
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor={`ticker-${asset.id}`} className="text-xs">
                      Ticker
                    </Label>
                    <Input
                      id={`ticker-${asset.id}`}
                      value={asset.ticker}
                      onChange={(e) =>
                        handleUpdateAsset(asset.id, "ticker", e.target.value)
                      }
                      className="w-full"
                      placeholder="Ticker"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Label htmlFor={`quantity-${asset.id}`} className="text-xs">
                      Quantidade
                    </Label>
                    <Input
                      id={`quantity-${asset.id}`}
                      type="number"
                      value={asset.quantity}
                      onChange={(e) =>
                        handleUpdateAsset(asset.id, "quantity", e.target.value)
                      }
                      className="w-full"
                      placeholder="Qtd"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Label htmlFor={`class-${asset.id}`} className="text-xs">
                      Classe
                    </Label>
                    <select
                      id={`class-${asset.id}`}
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
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Label htmlFor={`score-${asset.id}`} className="text-xs">
                      Nota (1-10)
                    </Label>
                    <Input
                      id={`score-${asset.id}`}
                      type="number"
                      value={asset.score}
                      onChange={(e) =>
                        handleUpdateAsset(asset.id, "score", e.target.value)
                      }
                      className="w-full"
                      placeholder="Nota"
                      min="1"
                      max="10"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Label htmlFor={`price-${asset.id}`} className="text-xs">
                      Preço (R$)
                    </Label>
                    <Input
                      id={`price-${asset.id}`}
                      type="number"
                      value={asset.price}
                      onChange={(e) => {
                        const newPrice = parseFloat(e.target.value);
                        if (!isNaN(newPrice) && newPrice > 0) {
                          handleUpdateAsset(asset.id, "price", e.target.value);
                        }
                      }}
                      className="w-full"
                      step="0.01"
                      min="0.01"
                      placeholder="Preço"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Label htmlFor={`idealPercentage-${asset.id}`}>
                      Percentual ideal
                    </Label>

                    <Input
                      id={`idealPercentage-${asset.id}`}
                      type="text"
                      value={`${(asset.idealPercentage * 100).toFixed(2)}%`}
                      disabled
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Label htmlFor={`actualPercentage-${asset.id}`}>
                      Percentual atual
                    </Label>

                    <Input
                      id={`actualPercentage-${asset.id}`}
                      type="text"
                      value={`${(
                        ((asset.price * asset.quantity) / totalInvestment) *
                        100
                      ).toFixed(2)}%`}
                      disabled
                    />
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAsset(asset.id)}
                    className="w-full"
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col space-y-4 mt-6">
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

          <div
            className={clsx(
              classId === DEFAULT_ASSET_CLASSES_IDS.TESOURO_DIRETO && "hidden"
            )}
          >
            <Label htmlFor="ticker">Ticker</Label>
            <Input
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Ex: PETR4 (Petrobras), LFTS11 (Tesouro Selic)..."
            />
          </div>

          <div
            className={clsx(
              classId !== DEFAULT_ASSET_CLASSES_IDS.TESOURO_DIRETO && "hidden"
            )}
          >
            <Label htmlFor="tesouroType">Tipo de Tesouro</Label>
            <select
              id="tesouroType"
              value={tesouroType}
              onChange={(e) =>
                setTesouroType(e.target.value as "selic" | "prefixado")
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {DEFAULT_TESOURO_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
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
            <Label htmlFor="score">Nota (1-10)</Label>
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

          <div className="flex gap-2">
            <Button
              onClick={handleAddAsset}
              disabled={loading}
              className="w-full max-w-48"
            >
              {loading ? "Buscando dados..." : "Adicionar Ativo"}
            </Button>

            {assets.length > 0 && (
              <Button
                variant="outline"
                className="w-full max-w-48"
                onClick={() => router.push("#contribution")}
              >
                Próximo
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
