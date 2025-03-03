"use client";

import { useState, useEffect } from "react";
import { AssetClassForm } from "@/components/AssetClassForm";
import { AssetForm } from "@/components/AssetForm";
import { ContributionForm } from "@/components/ContributionForm";
import { InvestmentResults } from "@/components/InvestmentResults";
import { Timeline, TimelineStep } from "@/components/Timeline";
import { AssetClass, Asset, Investment } from "@/lib/types";
import {
  initializeData,
  updateAssetClasses,
  updateAssets,
  updateContributionAmount,
  updateInvestments,
  updateTotalInvestment,
} from "@/lib/storage";
import { calculateInvestmentDistribution } from "@/lib/calculator";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Article } from "@/components/Article";
import Image from "next/image";

const STEPS = {
  ASSET_CLASSES: "asset-classes",
  ASSETS: "assets",
  CONTRIBUTION: "contribution",
  RESULTS: "results",
};

export default function Home() {
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.ASSET_CLASSES);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    {
      [STEPS.ASSET_CLASSES]: false,
      [STEPS.ASSETS]: false,
      [STEPS.CONTRIBUTION]: false,
      [STEPS.RESULTS]: false,
    }
  );

  function deleteAllData() {
    localStorage.removeItem("cerrado-diagram-data");
    router.push("/");

    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        console.log(
          "Raw localStorage:",
          localStorage.getItem("cerrado-diagram-data")
        );

        const data = initializeData();
        console.log("Loaded data:", data);

        if (data) {
          const assetClassesFromStorage = Array.isArray(data.assetClasses)
            ? data.assetClasses
            : [];
          const assetsFromStorage = Array.isArray(data.assets)
            ? data.assets
            : [];
          const investmentsFromStorage = Array.isArray(data.investments)
            ? data.investments
            : [];

          setAssetClasses(assetClassesFromStorage);
          setAssets(assetsFromStorage);
          setContributionAmount(data.contributionAmount || 0);
          setInvestments(investmentsFromStorage);
          setTotalInvestment(data.totalInvestment || 0);

          let newCurrentStep = STEPS.ASSET_CLASSES;

          setCompletedSteps((prev) => {
            const updatedSteps = { ...prev };

            if (assetClassesFromStorage.length > 0) {
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

            if (data.contributionAmount > 0) {
              updatedSteps[STEPS.CONTRIBUTION] = true;

              if (newCurrentStep === STEPS.CONTRIBUTION) {
                newCurrentStep = STEPS.RESULTS;
              }
            }

            return updatedSteps;
          });

          setTimeout(() => {
            setCurrentStep(newCurrentStep);

            if (newCurrentStep !== STEPS.ASSET_CLASSES) {
              router.push(`#${newCurrentStep}`);
            }
          }, 200);
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Erro ao carregar dados salvos");
    }
  }, [router]);

  useEffect(() => {
    if (assets.length > 0) {
      const total = assets.reduce(
        (sum, asset) => sum + asset.price * asset.quantity,
        0
      );
      setTotalInvestment(total);
      updateTotalInvestment(total);
    }
  }, [assets]);

  const handleSaveAssetClasses = (newAssetClasses: AssetClass[]) => {
    setAssetClasses(newAssetClasses);
    updateAssetClasses(newAssetClasses);

    if (newAssetClasses.length > 0) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSET_CLASSES]: true }));
      setCurrentStep(STEPS.ASSETS);
    } else {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSET_CLASSES]: false }));
    }
  };

  const handleSaveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    updateAssets(newAssets);

    if (newAssets.length > 0) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSETS]: true }));
      setCurrentStep(STEPS.CONTRIBUTION);
    } else {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSETS]: false }));
    }
  };

  const handleSaveContribution = (amount: number) => {
    setContributionAmount(amount);
    updateContributionAmount(amount);

    if (amount > 0) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.CONTRIBUTION]: true }));

      const calculatedInvestments = calculateInvestmentDistribution(
        assetClasses,
        assets,
        totalInvestment,
        amount
      );

      setInvestments(calculatedInvestments);
      updateInvestments(calculatedInvestments);

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
    updateContributionAmount(0);
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
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-end gap-2 mb-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={500}
          height={500}
          className="w-14 h-auto"
        />
        <h1 className="text-2xl font-bold mb-2">Diagrama do Cerrado</h1>
      </div>
      <div className="text-sm flex flex-col gap-4 text-muted-foreground">
        <p>
          Essa ferramenta foi desenvolvida para ajudar você a calcular a
          distribuição de seus investimentos usando o método do Diagrama do
          Cerrado.
        </p>
        <p>Para usar essa ferramenta basta seguir 4 passos simples:</p>

        <ul className="space-y-2">
          <li>
            <strong>1. Classes de Ativos</strong> - Defina as classes de ativos
            que deseja incluir no seu diagrama e o percentual para cada classe.
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
            <strong>4. Resultado</strong> - A ferramenta irá mostrar o resultado
            da distribuição de seus investimentos te informando quanto deve
            investir em cada ativo.
          </li>
        </ul>
      </div>

      <Timeline steps={timelineSteps} currentStep={currentStep} />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: "#10B981",
              secondary: "white",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "white",
            },
          },
        }}
      />

      <Button variant="destructive" onClick={deleteAllData} className="mt-4">
        Limpar tudo
      </Button>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          <strong>OBS:</strong> A ferramenta irá salvar todos os dados no seu
          navegador para que não precise informar os dados novamente sempre que
          você acessar a ferramenta.
        </p>
      </div>

      <hr className="my-8" />

      <div className="mt-12">
        <Article />
      </div>
    </main>
  );
}
