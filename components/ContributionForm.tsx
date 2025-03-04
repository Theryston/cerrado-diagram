import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobal } from "@/app/context";
import { useRouter } from "next/navigation";

export function ContributionForm() {
  const { setContributionAmount, contributionAmount } = useGlobal();
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardContent className="mt-6">
        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="amount">Quanto deseja aportar?</Label>
            <Input
              id="amount"
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(Number(e.target.value))}
              placeholder="Ex: 1000"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => router.push("#results")}
              className="w-full max-w-48"
            >
              Ver Resultado
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
