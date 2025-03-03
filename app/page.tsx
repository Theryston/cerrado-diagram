"use client";

import { useState, useEffect, useRef } from "react";
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

// Step IDs
const STEPS = {
  ASSET_CLASSES: "asset-classes",
  ASSETS: "assets",
  CONTRIBUTION: "contribution",
  RESULTS: "results",
  COMPLETE: "complete",
};

export default function Home() {
  // State for all data
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Create refs for scrolling
  const completeStepRef = useRef<HTMLDivElement>(null);
  const assetsStepRef = useRef<HTMLDivElement>(null);

  // Current step
  const [currentStep, setCurrentStep] = useState(STEPS.ASSET_CLASSES);

  // Step completion status
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    {
      [STEPS.ASSET_CLASSES]: false,
      [STEPS.ASSETS]: false,
      [STEPS.CONTRIBUTION]: false,
      [STEPS.RESULTS]: false,
      [STEPS.COMPLETE]: false,
    }
  );

  // Initialize data from localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // For debugging - log what's in localStorage
        console.log(
          "Raw localStorage:",
          localStorage.getItem("cerrado-diagram-data")
        );

        const data = initializeData();
        console.log("Loaded data:", data);

        if (data) {
          // Explicitly cast to arrays if needed
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

          // Set completed steps based on data
          const updatedSteps = { ...completedSteps };
          let currentStep = STEPS.ASSET_CLASSES;

          if (assetClassesFromStorage.length > 0) {
            updatedSteps[STEPS.ASSET_CLASSES] = true;

            if (currentStep === STEPS.ASSET_CLASSES) {
              currentStep = STEPS.ASSETS;
            }
          }

          if (assetsFromStorage.length > 0) {
            updatedSteps[STEPS.ASSETS] = true;
            if (currentStep === STEPS.ASSETS) {
              currentStep = STEPS.CONTRIBUTION;
            }
          }

          if (data.contributionAmount > 0) {
            updatedSteps[STEPS.CONTRIBUTION] = true;

            if (currentStep === STEPS.CONTRIBUTION) {
              currentStep = STEPS.RESULTS;
            }
          }

          setCompletedSteps(updatedSteps);
          setCurrentStep(currentStep);
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Erro ao carregar dados salvos");
    } finally {
      setDataLoaded(true);
    }
  }, []);

  // Calculate total investment whenever assets change
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

  // Handle asset classes save
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

  // Handle assets save
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

  // Handle contribution amount save
  const handleSaveContribution = (amount: number) => {
    setContributionAmount(amount);
    updateContributionAmount(amount);

    if (amount > 0) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.CONTRIBUTION]: true }));

      // Calculate investment distribution
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

  // Handle actual investments save
  const handleSaveActualInvestments = (actualInvestments: Investment[]) => {
    // Update assets with new quantities based on actual investments
    const updatedAssets = [...assets];
    let totalAdded = 0;
    let totalAssets = 0;

    console.log("Processing actual investments:", actualInvestments);
    console.log("Current assets before update:", updatedAssets);

    // Compare with previous investments to find only new contributions
    actualInvestments.forEach((newInv) => {
      // Find the current investment to compare
      const currentInv = investments.find(
        (inv) => inv.assetId === newInv.assetId
      );

      // Only process if there's an actual value and it's different from before
      if (
        newInv.actual !== null &&
        newInv.actual > 0 &&
        (currentInv?.actual === null || currentInv?.actual !== newInv.actual)
      ) {
        const assetIndex = updatedAssets.findIndex(
          (a) => a.id === newInv.assetId
        );
        if (assetIndex !== -1) {
          const asset = updatedAssets[assetIndex];

          // Calculate how many new units to add based on difference
          const previousAmount = currentInv?.actual || 0;
          const additionalAmount = newInv.actual - previousAmount;
          const additionalUnits = Math.floor(additionalAmount / asset.price);

          console.log(
            `Asset ${asset.ticker}: Adding ${additionalUnits} units from R$ ${additionalAmount}`
          );

          if (additionalUnits > 0) {
            totalAdded += additionalAmount;
            totalAssets += 1;

            // Create a new asset object with updated quantity
            updatedAssets[assetIndex] = {
              ...asset,
              quantity: asset.quantity + additionalUnits,
            };
          }
        }
      }
    });

    console.log("Updated assets after calculation:", updatedAssets);

    // Important: First update state, then localStorage
    setAssets(updatedAssets);

    // Force a data update in localStorage
    const updatedData = updateAssets(updatedAssets);
    setInvestments(actualInvestments);
    updateInvestments(actualInvestments);

    console.log("Complete updated data in localStorage:", updatedData);

    // Mark steps as completed and advance to complete step
    setCompletedSteps((prev) => ({
      ...prev,
      [STEPS.RESULTS]: true,
      [STEPS.COMPLETE]: true,
    }));
    setCurrentStep(STEPS.COMPLETE);

    // Show success message
    toast.success(
      totalAdded > 0
        ? `Sucesso! Adicionados R$ ${totalAdded.toFixed(
            2
          )} em ${totalAssets} ativo(s).`
        : "Aportes salvos com sucesso!"
    );

    // Scroll to asset step to see updated assets
    setTimeout(() => {
      if (completeStepRef.current) {
        completeStepRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Reset for new calculation
  const handleReset = () => {
    setCurrentStep(STEPS.CONTRIBUTION);
    setCompletedSteps((prev) => ({
      ...prev,
      [STEPS.CONTRIBUTION]: false,
      [STEPS.RESULTS]: false,
    }));
    setContributionAmount(0);
    updateContributionAmount(0);
  };

  // Define timeline steps
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
        <div ref={assetsStepRef}>
          <AssetForm
            assets={assets}
            assetClasses={assetClasses}
            onSave={handleSaveAssets}
          />
        </div>
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
          onSaveActual={handleSaveActualInvestments}
          onReset={handleReset}
        />
      ),
    },
    {
      id: STEPS.COMPLETE,
      title: "5. Aportes Adicionados",
      isComplete: completedSteps[STEPS.COMPLETE],
      content: (
        <div
          ref={completeStepRef}
          className="my-8 p-6 border rounded-lg bg-green-50"
        >
          <h2 className="text-xl font-bold text-green-800 mb-4">
            Aportes Adicionados com Sucesso!
          </h2>
          <p className="mb-4">
            Os aportes foram adicionados à sua carteira. Você pode verificar os
            ativos atualizados na seção "Ativos".
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (assetsStepRef.current) {
                  setCurrentStep(STEPS.ASSETS);
                  setTimeout(() => {
                    assetsStepRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 100);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Ver Ativos Atualizados
            </button>
            <button
              onClick={() => {
                setCurrentStep(STEPS.CONTRIBUTION);
                setCompletedSteps((prev) => ({
                  ...prev,
                  [STEPS.CONTRIBUTION]: false,
                  [STEPS.RESULTS]: false,
                  [STEPS.COMPLETE]: false,
                }));
                setContributionAmount(0);
                updateContributionAmount(0);
                toast.success("Pronto para um novo cálculo!");
              }}
              className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
            >
              Novo Cálculo
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Diagrama do Cerrado</h1>
      <p className="text-lg mb-8">
        Ferramenta para cálculo de distribuição de investimentos usando o método
        do Diagrama do Cerrado
      </p>

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
    </main>
  );
}
