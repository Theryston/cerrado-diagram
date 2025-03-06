"use client";

import { useGlobal } from "@/app/context";
import { Dialog, DialogContent } from "./ui/dialog";
import { useState, useEffect } from "react";
import { Asset, ChecklistItem } from "@/lib/types";
import { CHECKLIST_ITEMS } from "@/lib/constants";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import clsx from "clsx";
import { toast } from "sonner";

export function ModelCalculator() {
  const {
    isCalculationOpen,
    assetToCalculate,
    setIsCalculationOpen,
    handleUpdateAsset,
  } = useGlobal();
  const [step, setStep] = useState<"checklist" | "result">("checklist");
  const [score, setScore] = useState<number>(0);

  const handleCalculate = (checkedItems: ChecklistItem[]) => {
    setStep("result");
    setScore(checkedItems.reduce((acc, item) => acc + item.points, 0));
  };

  const handleSave = (score: number) => {
    if (!assetToCalculate) {
      toast.error("Ativo não encontrado");
      return;
    }

    handleUpdateAsset(assetToCalculate.id, "score", score.toString());
    setIsCalculationOpen(false);

    toast.success("Nota salva com sucesso");
  };

  useEffect(() => {
    if (isCalculationOpen) {
      setStep("checklist");
      setScore(0);
    }
  }, [isCalculationOpen]);

  if (!assetToCalculate) return null;

  return (
    <Dialog open={isCalculationOpen} onOpenChange={setIsCalculationOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-4">
          {step === "checklist" && (
            <ChecklistStep
              asset={assetToCalculate}
              onCalculate={handleCalculate}
            />
          )}
          {step === "result" && (
            <ResultStep
              score={score}
              onBack={() => setStep("checklist")}
              onSave={handleSave}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChecklistStep({
  asset,
  onCalculate,
}: {
  asset: Asset;
  onCalculate: (checkedItems: ChecklistItem[]) => void;
}) {
  const checklistClass = CHECKLIST_ITEMS[asset.classId];
  const [selectedChecklist, setSelectedChecklist] = useState(checklistClass[0]);
  const [checkedItems, setCheckedItems] = useState<ChecklistItem[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Calcular nota {asset.ticker}</h3>
        <p className="text-sm text-muted-foreground">
          Selecione os critérios que fazem o ativo ser considerado um ativo de
          qualidade e o sistema calculará a nota para você.
        </p>
      </div>

      {checklistClass.length > 1 && (
        <div className="flex flex-col gap-2">
          <Label htmlFor={`checklist-${asset.id}`}>
            Selecione o tipo de ativo
          </Label>
          <select
            id={`checklist-${asset.id}`}
            value={selectedChecklist.label}
            onChange={(e) => {
              setSelectedChecklist(
                checklistClass.find((c) => c.label === e.target.value) ||
                  checklistClass[0]
              );
              setCheckedItems([]);
            }}
            className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            {checklistClass.map((checklist) => (
              <option key={checklist.label} value={checklist.label}>
                {checklist.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <div key={selectedChecklist.label} className="flex flex-col gap-4">
        {selectedChecklist.items.map((item) => (
          <div key={item.label} className="flex items-start gap-2">
            <Checkbox
              id={item.label}
              checked={
                checkedItems.find((i) => i.label === item.label) !== undefined
              }
              onCheckedChange={() =>
                setCheckedItems((prev) =>
                  prev.find((i) => i.label === item.label)
                    ? prev.filter((i) => i.label !== item.label)
                    : [...prev, item]
                )
              }
            />
            <Label htmlFor={item.label} className="flex flex-col gap-2">
              <h4 className="text-sm font-bold">{item.label}</h4>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </Label>
          </div>
        ))}
      </div>

      <Button onClick={() => onCalculate(checkedItems)}>Calcular nota</Button>
    </div>
  );
}

function ResultStep({
  score,
  onBack,
  onSave,
}: {
  score: number;
  onBack: () => void;
  onSave: (score: number) => void;
}) {
  const normalizedScore = Math.min(Math.max((score / 10) * 10, 1), 10);

  const shouldInvest = normalizedScore >= 5;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-2xl font-bold">Nota final</h3>
        <p
          className={clsx(
            "text-6xl font-bold",
            shouldInvest ? "text-green-500" : "text-red-500"
          )}
        >
          {normalizedScore.toFixed(1)}
        </p>
      </div>

      <div className="text-center">
        {shouldInvest ? (
          <p className="text-muted-foreground">
            {score} de 10 critérios atendidos
          </p>
        ) : (
          <p className="text-red-500">
            Não é uma boa ideia investir nesse ativo.
          </p>
        )}

        <p className="text-sm text-muted-foreground mt-2">
          A nota é calculada com base nos critérios selecionados, onde cada
          critério vale ponto.
        </p>
      </div>

      <div className="flex gap-2 w-full max-w-sm">
        <Button onClick={onBack} className="w-full" variant="outline">
          Voltar
        </Button>
        <Button className="w-full" onClick={() => onSave(score)}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
