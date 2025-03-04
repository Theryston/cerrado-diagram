import React, { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Input } from "./ui/input";
import { CharClass } from "./CharClass";
import { DEFAULT_ASSET_CLASSES } from "@/lib/constants";
import { useGlobal } from "@/app/context";

export function AssetClassForm() {
  const { assetClasses, setAssetClasses } = useGlobal();
  const router = useRouter();
  const oldPercentages = useRef<Record<string, number>>({});

  const totalPercentage = assetClasses.reduce(
    (sum, cls) => sum + cls.percentage,
    0
  );

  const handleUpdateClass = useCallback(
    (id: string, percentage: number) => {
      const oldPercentage = oldPercentages.current[id] || 0;
      const isIncreasing = percentage > oldPercentage;

      const totalPercentageIgnoringCurrentClass = assetClasses.reduce(
        (sum, cls) => sum + (cls.id === id ? 0 : cls.percentage),
        0
      );

      if (
        totalPercentageIgnoringCurrentClass + percentage > 100 &&
        isIncreasing
      ) {
        percentage = 100 - totalPercentageIgnoringCurrentClass;
      }

      setAssetClasses((prevClasses) => {
        const classExists = prevClasses.find((cls) => cls.id === id);

        let newClasses = [...prevClasses];

        if (!classExists) {
          newClasses.push({
            id,
            name:
              DEFAULT_ASSET_CLASSES.find((cls) => cls.id === id)?.name || "",
            percentage,
            color:
              DEFAULT_ASSET_CLASSES.find((cls) => cls.id === id)?.color ||
              "#000000",
          });
        } else {
          newClasses = newClasses.map((cls) => {
            if (cls.id === id) {
              return { ...cls, percentage };
            }

            return cls;
          });
        }

        return newClasses;
      });

      oldPercentages.current[id] = percentage;
    },
    [assetClasses, setAssetClasses]
  );

  return (
    <Card className="w-full">
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CharClass
          assetClasses={[
            ...assetClasses,
            {
              id: "13",
              name: "Não alocado",
              percentage: 100 - totalPercentage,
              color: "#808080",
            },
          ]}
          totalPercentage={totalPercentage}
        />

        <div className="space-y-4 my-6">
          {DEFAULT_ASSET_CLASSES.map((cls) => {
            const classPercentage = assetClasses.find(
              (c) => c.id === cls.id
            )?.percentage;

            const percentage =
              classPercentage === undefined ? cls.percentage : classPercentage;

            return (
              <div
                className="flex flex-col gap-4 p-3 bg-muted rounded-md"
                key={cls.id}
              >
                <div className="flex justify-between">
                  <p>{cls.name}</p>

                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={percentage}
                      onChange={(e) =>
                        handleUpdateClass(cls.id, Number(e.target.value))
                      }
                      className="w-16"
                    />
                    <p>%</p>
                  </div>
                </div>
                <Slider
                  value={[percentage]}
                  onValueChange={(value) => handleUpdateClass(cls.id, value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                  trackClassName="bg-gray-400"
                  rangeColor={cls.color}
                />
              </div>
            );
          })}

          <div className="flex gap-2 justify-end">
            {assetClasses.length > 0 && totalPercentage === 100 && (
              <Button
                variant="outline"
                className="w-full md:max-w-48"
                onClick={() => router.push("#assets")}
              >
                Próximo
              </Button>
            )}
            {totalPercentage !== 100 && (
              <p className="text-sm text-red-500">
                Total de percentuais deve ser 100%
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
