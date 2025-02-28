import React, { useState, useEffect } from "react";
import { AssetClass } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AssetClassFormProps {
  assetClasses: AssetClass[];
  onSave: (assetClasses: AssetClass[]) => void;
}

export function AssetClassForm({ assetClasses, onSave }: AssetClassFormProps) {
  const [classes, setClasses] = useState<AssetClass[]>(assetClasses);
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [error, setError] = useState("");

  // Update classes when assetClasses props changes
  useEffect(() => {
    setClasses(assetClasses);
  }, [assetClasses]);

  // Calculate total percentage
  const totalPercentage = classes.reduce((sum, cls) => sum + cls.percentage, 0);

  const handleAddClass = () => {
    // Validate inputs
    if (!name.trim()) {
      setError("Nome da classe de ativos é obrigatório");
      return;
    }

    const parsedPercentage = parseFloat(percentage);
    if (isNaN(parsedPercentage) || parsedPercentage <= 0) {
      setError("Percentual precisa ser um número positivo");
      return;
    }

    // Check if total percentage would exceed 100%
    if (totalPercentage + parsedPercentage > 100) {
      setError("Total de percentuais não pode exceder 100%");
      return;
    }

    // Add new asset class
    const newClass: AssetClass = {
      id: Date.now().toString(),
      name: name.trim(),
      percentage: parsedPercentage,
    };

    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);

    // Clear inputs
    setName("");
    setPercentage("");
    setError("");

    // Save to parent component
    onSave(updatedClasses);
  };

  const handleRemoveClass = (id: string) => {
    const updatedClasses = classes.filter((cls) => cls.id !== id);
    setClasses(updatedClasses);
    onSave(updatedClasses);
  };

  const handleUpdateClass = (
    id: string,
    field: keyof AssetClass,
    value: string
  ) => {
    const updatedClasses = classes.map((cls) => {
      if (cls.id === id) {
        if (field === "name") {
          return { ...cls, name: value };
        } else if (field === "percentage") {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue)) {
            return { ...cls, percentage: parsedValue };
          }
        }
      }
      return cls;
    });

    setClasses(updatedClasses);
    onSave(updatedClasses);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <p className="text-sm">
          Total alocado:{" "}
          <span
            className={
              totalPercentage > 100 ? "text-red-500 font-bold" : "font-bold"
            }
          >
            {totalPercentage}%
          </span>
          {totalPercentage > 100 && " (excede 100%)"}
          {totalPercentage < 100 &&
            totalPercentage > 0 &&
            ` (falta ${100 - totalPercentage}%)`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center space-x-2 p-3 border rounded-md"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <Input
                    value={cls.name}
                    onChange={(e) =>
                      handleUpdateClass(cls.id, "name", e.target.value)
                    }
                    className="flex-grow"
                    placeholder="Nome da classe"
                  />
                  <Input
                    type="number"
                    value={cls.percentage}
                    onChange={(e) =>
                      handleUpdateClass(cls.id, "percentage", e.target.value)
                    }
                    className="w-20"
                    placeholder="%"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveClass(cls.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="className">Nome da Classe</Label>
            <Input
              id="className"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ações Nacionais"
            />
          </div>

          <div>
            <Label htmlFor="percentage">Percentual (%)</Label>
            <Input
              id="percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="Ex: 25"
            />
          </div>

          <Button onClick={handleAddClass}>Adicionar Classe</Button>
        </div>
      </CardContent>
    </Card>
  );
}
