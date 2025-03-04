import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Valor do aporte precisa ser um número positivo");
      return;
    }

    setError("");
    onSave(parsedAmount);

    router.push("#results");
  };

  useEffect(() => {
    setAmount(currentAmount.toString());
  }, [currentAmount]);

  return (
    <Card className="w-full">
      <CardContent className="mt-6">
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

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="w-full max-w-48">
              Calcular Distribuição
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
