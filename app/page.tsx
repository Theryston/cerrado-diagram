"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AssetClassForm } from "@/components/AssetClassForm";
import { AssetForm } from "@/components/AssetForm";
import { ContributionForm } from "@/components/ContributionForm";
import { InvestmentResults } from "@/components/InvestmentResults";
import { Timeline, TimelineStep } from "@/components/Timeline";
import { AssetClass, Asset, Investment } from "@/lib/types";
import { calculateInvestmentDistribution } from "@/lib/calculator";
import { useRouter } from "next/navigation";
import { Article } from "@/components/Article";
import { Header } from "@/components/Header";
import { STEPS } from "@/lib/constants";
import { useSaveWalletData, useWalletData } from "@/lib/hooks";

export default function Home() {
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.ASSET_CLASSES);
  const [code, setCode] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("cerrado-diagram-code") || ""
      : ""
  );
  const { mutateAsync: saveWalletDataMutation } = useSaveWalletData(code);
  const { data } = useWalletData(code);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    {
      [STEPS.ASSET_CLASSES]: false,
      [STEPS.ASSETS]: false,
      [STEPS.CONTRIBUTION]: false,
      [STEPS.RESULTS]: false,
    }
  );
  const onSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem("cerrado-diagram-code", code);
  }, [code]);

  const calculateSteps = useCallback(
    ({
      assetClassesFromStorage,
      assetsFromStorage,
      contributionAmount,
    }: {
      assetClassesFromStorage: AssetClass[];
      assetsFromStorage: Asset[];
      contributionAmount: number;
    }) => {
      let newCurrentStep = STEPS.ASSET_CLASSES;

      setCompletedSteps((prev) => {
        const updatedSteps = { ...prev };

        const totalClassPercentage = assetClassesFromStorage.reduce(
          (sum, cls) => sum + cls.percentage,
          0
        );

        if (
          assetClassesFromStorage.length > 0 &&
          totalClassPercentage === 100
        ) {
          updatedSteps[STEPS.ASSET_CLASSES] = true;

          if (newCurrentStep === STEPS.ASSET_CLASSES) {
            newCurrentStep = STEPS.ASSETS;
          }
        }

        if (assetsFromStorage.length > 0) {
          updatedSteps[STEPS.ASSETS] = true;

          if (newCurrentStep === STEPS.ASSETS) {
            newCurrentStep = STEPS.CONTRIBUTION;
          }
        }

        if (contributionAmount > 0) {
          updatedSteps[STEPS.CONTRIBUTION] = true;

          if (newCurrentStep === STEPS.CONTRIBUTION) {
            newCurrentStep = STEPS.RESULTS;
          }
        }

        return updatedSteps;
      });

      setTimeout(() => {
        setCurrentStep(newCurrentStep);
      }, 200);
    },
    []
  );

  useEffect(() => {
    console.log("Loaded data:", data);

    if (data) {
      const assetClassesFromStorage = Array.isArray(data.assetClasses)
        ? data.assetClasses
        : [];
      const assetsFromStorage = Array.isArray(data.assets) ? data.assets : [];
      const investmentsFromStorage = Array.isArray(data.investments)
        ? data.investments
        : [];

      setAssetClasses(assetClassesFromStorage);
      setAssets(assetsFromStorage);
      setContributionAmount(data.contributionAmount || 0);
      setInvestments(investmentsFromStorage);
      setTotalInvestment(data.totalInvestment || 0);
    }
  }, [data]);

  useEffect(() => {
    calculateSteps({
      assetClassesFromStorage: assetClasses,
      assetsFromStorage: assets,
      contributionAmount: contributionAmount,
    });
  }, [assetClasses, assets, contributionAmount, calculateSteps]);

  useEffect(() => {
    if (assets.length > 0) {
      const total = assets.reduce(
        (sum, asset) => sum + asset.price * asset.quantity,
        0
      );
      setTotalInvestment(total);
    }
  }, [assets]);

  function generateCode() {
    return Math.floor(0 + Math.random() * 900000)
      .toString()
      .padStart(6, "0");
  }

  const handleSave = useCallback(
    ({
      newAssetClasses,
      newAssets,
      newContributionAmount,
      newInvestments,
    }: {
      newAssetClasses: AssetClass[];
      newAssets: Asset[];
      newContributionAmount: number;
      newInvestments: Investment[];
    }) => {
      if (onSaveTimeout.current) clearTimeout(onSaveTimeout.current);

      onSaveTimeout.current = setTimeout(() => {
        let newCode = code;

        if (newCode === "") {
          newCode = generateCode();
          setCode(newCode);
        }

        setAssetClasses(newAssetClasses);
        setAssets(newAssets);
        setContributionAmount(newContributionAmount);
        setInvestments(newInvestments);

        const newData = {
          assetClasses: newAssetClasses,
          assets: newAssets,
          contributionAmount: newContributionAmount,
          investments: newInvestments,
        };

        const currentDataStr = JSON.stringify(data);
        const dataString = JSON.stringify(newData);

        if (currentDataStr === dataString) return;
        saveWalletDataMutation(dataString);
      }, 1000);
    },
    [code, saveWalletDataMutation, data]
  );

  useEffect(() => {
    handleSave({
      newAssetClasses: assetClasses,
      newAssets: assets,
      newContributionAmount: contributionAmount,
      newInvestments: investments,
    });
  }, [assetClasses, assets, contributionAmount, handleSave, investments]);

  const handleSaveAssetClasses = (newAssetClasses: AssetClass[]) => {
    setAssetClasses(newAssetClasses);

    const totalPercentage = newAssetClasses.reduce(
      (sum, cls) => sum + cls.percentage,
      0
    );

    if (newAssetClasses.length > 0 && totalPercentage === 100) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSET_CLASSES]: true }));
      setCurrentStep(STEPS.ASSETS);
    } else {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSET_CLASSES]: false }));
    }
  };

  const handleSaveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);

    if (newAssets.length > 0) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSETS]: true }));
      setCurrentStep(STEPS.CONTRIBUTION);
    } else {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSETS]: false }));
    }
  };

  const handleSaveContribution = (amount: number) => {
    setContributionAmount(amount);

    if (amount > 0) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.CONTRIBUTION]: true }));

      const calculatedInvestments = calculateInvestmentDistribution(
        assetClasses,
        assets,
        totalInvestment,
        amount
      );

      setInvestments(calculatedInvestments);
      setCurrentStep(STEPS.RESULTS);
    } else {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.CONTRIBUTION]: false }));
    }
  };

  const handleReset = () => {
    setCurrentStep(STEPS.CONTRIBUTION);
    setCompletedSteps((prev) => ({
      ...prev,
      [STEPS.CONTRIBUTION]: false,
      [STEPS.RESULTS]: false,
    }));
    setContributionAmount(0);
    router.push("#contribution");
  };

  const timelineSteps: TimelineStep[] = [
    {
      id: STEPS.ASSET_CLASSES,
      title: "1. Classes de Ativos",
      description:
        "Defina as classes de ativos que deseja incluir no seu diagrama e o percentual para cada classe.",
      isComplete: completedSteps[STEPS.ASSET_CLASSES],
      content: (
        <AssetClassForm
          assetClasses={assetClasses}
          onSave={handleSaveAssetClasses}
        />
      ),
    },
    {
      id: STEPS.ASSETS,
      title: "2. Ativos",
      description:
        "Defina os ativos que você deseja incluir no seu diagrama e a quantidade que você tem de cada ativo. (OBS: Se você não tem um ativo, você pode inserir o valor 0)",
      isComplete: completedSteps[STEPS.ASSETS],
      content: (
        <AssetForm
          assets={assets}
          assetClasses={assetClasses}
          onSave={handleSaveAssets}
        />
      ),
    },
    {
      id: STEPS.CONTRIBUTION,
      title: "3. Aporte",
      description:
        "Defina o valor que você deseja investir, e o diagrama calculará a quantidade de cada ativo para você.",
      isComplete: completedSteps[STEPS.CONTRIBUTION],
      content: (
        <ContributionForm
          currentAmount={contributionAmount}
          onSave={handleSaveContribution}
        />
      ),
    },
    {
      id: STEPS.RESULTS,
      title: "4. Resultado",
      isComplete: completedSteps[STEPS.RESULTS],
      content: (
        <InvestmentResults
          investments={investments}
          assets={assets}
          assetClasses={assetClasses}
          onReset={handleReset}
        />
      ),
    },
  ];

  return (
    <>
      <Header code={code} setCode={setCode} />

      <main className="container mx-auto pb-8 px-4">
        <div className="text-sm flex flex-col gap-4 text-muted-foreground">
          <p>
            Essa ferramenta foi desenvolvida para ajudar você a calcular a
            distribuição de seus investimentos usando o método do Diagrama do
            Cerrado.
          </p>
          <p>Para usar essa ferramenta basta seguir 4 passos simples:</p>

          <ul className="space-y-2">
            <li>
              <strong>1. Classes de Ativos</strong> - Defina as classes de
              ativos que deseja incluir no seu diagrama e o percentual para cada
              classe.
            </li>
            <li>
              <strong>2. Ativos</strong> - Defina os ativos que você deseja
              incluir no seu diagrama, dê uma nota para esses ativos e informe a
              quantidade que você já tem de cada ativo. (OBS: Se você não tem um
              ativo, você pode inserir o valor 0)
            </li>
            <li>
              <strong>3. Aporte</strong> - Defina o valor que você deseja
              investir, e a ferramenta calculará a quantidade de cada ativo para
              você.
            </li>
            <li>
              <strong>4. Resultado</strong> - A ferramenta irá mostrar o
              resultado da distribuição de seus investimentos te informando
              quanto deve investir em cada ativo.
            </li>
          </ul>
        </div>

        <Timeline steps={timelineSteps} currentStep={currentStep} />

        <hr className="my-8" />

        <div className="mt-12">
          <Article />
        </div>
      </main>
    </>
  );
}
