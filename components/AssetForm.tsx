import React, { useState, useEffect, useRef } from "react";
import { Asset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getIdealPercentage } from "@/lib/calculator";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  CHECKLIST_ITEMS,
  DEFAULT_ASSET_CLASSES_IDS,
  DEFAULT_TESOURO_TYPES,
} from "@/lib/constants";
import { toast } from "sonner";
import { useAssetPrice } from "@/lib/hooks";
import { useGlobal } from "@/app/context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Calculator, Trash2 } from "lucide-react";

export function AssetForm() {
  const {
    assetClasses,
    assets,
    setAssets,
    setIsCalculationOpen,
    setAssetToCalculate,
    handleUpdateAsset,
  } = useGlobal();
  const [ticker, setTicker] = useState("");
  const [tickerValue, setTickerValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [classId, setClassId] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tesouroType, setTesouroType] = useState<string>("SELIC");
  const [isTesouroDireto, setIsTesouroDireto] = useState(false);
  const router = useRouter();
  const setTickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: assetPrice } = useAssetPrice(ticker, isTesouroDireto);

  useEffect(() => {
    if (setTickerTimeoutRef.current) clearTimeout(setTickerTimeoutRef.current);

    setTickerTimeoutRef.current = setTimeout(() => {
      setTicker(tickerValue);
    }, 500);
  }, [tickerValue]);

  useEffect(() => {
    setIsTesouroDireto(classId === DEFAULT_ASSET_CLASSES_IDS.TESOURO_DIRETO);
  }, [classId]);

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

    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
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
        ({ price, minInvestment } = assetPrice);

        if (!price) {
          toast.error(
            `Erro ao buscar preço do ativo ${ticker}! Insira o valor manualmente.`
          );
        }
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

      const updatedAssets = [...assets, newAsset];
      setAssets(updatedAssets);

      setTicker("");
      setTickerValue("");
      setTesouroType("SELIC");
      setQuantity("");
      setClassId("");
      setScore("");
    } catch {
      setError(
        "Erro ao buscar informações do ativo. Verifique o ticker e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAsset = (id: string) => {
    const updatedAssets = assets.filter((asset) => asset.id !== id);
    setAssets(updatedAssets);
  };

  const getAssetClassName = (classId: string) => {
    const assetClass = assetClasses.find((cls) => cls.id === classId);
    return assetClass ? assetClass.name : "Desconhecido";
  };

  const assetsByClass = assets.reduce<
    Record<string, (Asset & { idealPercentage: number })[]>
  >((acc, asset) => {
    const classId = asset.classId;
    if (!acc[classId]) {
      acc[classId] = [];
    }

    const assetClass = assetClasses.find((cls) => cls.id === classId);
    if (!assetClass) return acc;

    const assetsInClass = assets.filter((a) => a.classId === classId);

    const idealPercentage = getIdealPercentage(
      asset,
      assetClass,
      assetsInClass
    );

    acc[classId].push({ ...asset, idealPercentage });
    return acc;
  }, {});

  const totalInvestment = assets.reduce(
    (acc, asset) => acc + asset.price * asset.quantity,
    0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <p className="text-sm">
          Total de ativos: <span className="font-bold">{assets.length}</span>
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="w-full">
                        Mais opções
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleRemoveAsset(asset.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </DropdownMenuItem>
                      {Object.keys(CHECKLIST_ITEMS).includes(asset.classId) && (
                        <DropdownMenuItem
                          onClick={() => {
                            setIsCalculationOpen(true);
                            setAssetToCalculate(asset);
                          }}
                        >
                          <Calculator className="w-4 h-4 mr-2" />
                          Calcular nota
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              value={tickerValue}
              onChange={(e) => setTickerValue(e.target.value)}
              placeholder="Ex: PETR4"
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
              onChange={(e) => setTesouroType(e.target.value)}
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
