import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContributionFormProps {
  currentAmount: number;
  onSave: (amount: number) => void;
}

export function ContributionForm({
  currentAmount,
  onSave,
}: ContributionFormProps) {
  const [amount, setAmount] = useState(currentAmount.toString());
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validate input
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Valor do aporte precisa ser um número positivo");
      return;
    }

    setError("");
    onSave(parsedAmount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Valor do Aporte</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="amount">Quanto deseja aportar?</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 1000"
            />
          </div>

          <Button onClick={handleSubmit}>Calcular Distribuição</Button>
        </div>
      </CardContent>
    </Card>
  );
}
