'use client';

import { useState, useEffect } from 'react';
import { AssetClassForm } from '@/components/AssetClassForm';
import { AssetForm } from '@/components/AssetForm';
import { ContributionForm } from '@/components/ContributionForm';
import { InvestmentResults } from '@/components/InvestmentResults';
import { Timeline, TimelineStep } from '@/components/Timeline';
import { AssetClass, Asset, Investment } from '@/lib/types';
import { 
  initializeData, 
  updateAssetClasses, 
  updateAssets, 
  updateContributionAmount, 
  updateInvestments,
  updateTotalInvestment
} from '@/lib/storage';
import { calculateInvestmentDistribution } from '@/lib/calculator';

// Step IDs
const STEPS = {
  ASSET_CLASSES: 'asset-classes',
  ASSETS: 'assets',
  CONTRIBUTION: 'contribution',
  RESULTS: 'results'
};

export default function Home() {
  // State for all data
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  
  // Current step
  const [currentStep, setCurrentStep] = useState(STEPS.ASSET_CLASSES);
  
  // Step completion status
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    [STEPS.ASSET_CLASSES]: false,
    [STEPS.ASSETS]: false,
    [STEPS.CONTRIBUTION]: false,
    [STEPS.RESULTS]: false
  });

  // Initialize data from localStorage
  useEffect(() => {
    const data = initializeData();
    setAssetClasses(data.assetClasses || []);
    setAssets(data.assets || []);
    setContributionAmount(data.contributionAmount || 0);
    setInvestments(data.investments || []);
    setTotalInvestment(data.totalInvestment || 0);
    
    // Set completed steps based on data
    if (data.assetClasses.length > 0) {
      setCompletedSteps(prev => ({ ...prev, [STEPS.ASSET_CLASSES]: true }));
      if (currentStep === STEPS.ASSET_CLASSES) {
        setCurrentStep(STEPS.ASSETS);
      }
    }
    
    if (data.assets.length > 0) {
      setCompletedSteps(prev => ({ ...prev, [STEPS.ASSETS]: true }));
      if (currentStep === STEPS.ASSETS) {
        setCurrentStep(STEPS.CONTRIBUTION);
      }
    }
    
    if (data.contributionAmount > 0) {
      setCompletedSteps(prev => ({ ...prev, [STEPS.CONTRIBUTION]: true }));
      if (currentStep === STEPS.CONTRIBUTION) {
        setCurrentStep(STEPS.RESULTS);
      }
    }
  }, []);

  // Calculate total investment whenever assets change
  useEffect(() => {
    if (assets.length > 0) {
      const total = assets.reduce((sum, asset) => sum + (asset.price * asset.quantity), 0);
      setTotalInvestment(total);
      updateTotalInvestment(total);
    }
  }, [assets]);

  // Handle asset classes save
  const handleSaveAssetClasses = (newAssetClasses: AssetClass[]) => {
    setAssetClasses(newAssetClasses);
    updateAssetClasses(newAssetClasses);
    
    if (newAssetClasses.length > 0) {
      setCompletedSteps(prev => ({ ...prev, [STEPS.ASSET_CLASSES]: true }));
      setCurrentStep(STEPS.ASSETS);
    } else {
      setCompletedSteps(prev => ({ ...prev, [STEPS.ASSET_CLASSES]: false }));
    }
  };

  // Handle assets save
  const handleSaveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    updateAssets(newAssets);
    
    if (newAssets.length > 0) {
      setCompletedSteps(prev => ({ ...prev, [STEPS.ASSETS]: true }));
      setCurrentStep(STEPS.CONTRIBUTION);
    } else {
      setCompletedSteps(prev => ({ ...prev, [STEPS.ASSETS]: false }));
    }
  };

  // Handle contribution amount save
  const handleSaveContribution = (amount: number) => {
    setContributionAmount(amount);
    updateContributionAmount(amount);
    
    if (amount > 0) {
      setCompletedSteps(prev => ({ ...prev, [STEPS.CONTRIBUTION]: true }));
      
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
      setCompletedSteps(prev => ({ ...prev, [STEPS.CONTRIBUTION]: false }));
    }
  };

  // Handle actual investments save
  const handleSaveActualInvestments = (actualInvestments: Investment[]) => {
    // Update assets with new quantities based on actual investments
    const updatedAssets = [...assets];
    
    actualInvestments.forEach(inv => {
      if (inv.actual !== null && inv.actual > 0) {
        const assetIndex = updatedAssets.findIndex(a => a.id === inv.assetId);
        if (assetIndex !== -1) {
          const asset = updatedAssets[assetIndex];
          const additionalUnits = Math.floor(inv.actual / asset.price);
          updatedAssets[assetIndex] = {
            ...asset,
            quantity: asset.quantity + additionalUnits
          };
        }
      }
    });
    
    setAssets(updatedAssets);
    updateAssets(updatedAssets);
    setInvestments(actualInvestments);
    updateInvestments(actualInvestments);
  };

  // Reset for new calculation
  const handleReset = () => {
    setCurrentStep(STEPS.CONTRIBUTION);
    setCompletedSteps(prev => ({ 
      ...prev, 
      [STEPS.CONTRIBUTION]: false,
      [STEPS.RESULTS]: false 
    }));
    setContributionAmount(0);
    updateContributionAmount(0);
  };

  // Define timeline steps
  const timelineSteps: TimelineStep[] = [
    {
      id: STEPS.ASSET_CLASSES,
      title: '1. Classes de Ativos',
      isComplete: completedSteps[STEPS.ASSET_CLASSES],
      content: (
        <AssetClassForm 
          assetClasses={assetClasses} 
          onSave={handleSaveAssetClasses} 
        />
      )
    },
    {
      id: STEPS.ASSETS,
      title: '2. Ativos',
      isComplete: completedSteps[STEPS.ASSETS],
      content: (
        <AssetForm 
          assets={assets} 
          assetClasses={assetClasses} 
          onSave={handleSaveAssets} 
        />
      )
    },
    {
      id: STEPS.CONTRIBUTION,
      title: '3. Aporte',
      isComplete: completedSteps[STEPS.CONTRIBUTION],
      content: (
        <ContributionForm 
          currentAmount={contributionAmount} 
          onSave={handleSaveContribution} 
        />
      )
    },
    {
      id: STEPS.RESULTS,
      title: '4. Resultado',
      isComplete: completedSteps[STEPS.RESULTS],
      content: (
        <InvestmentResults 
          investments={investments} 
          assets={assets} 
          assetClasses={assetClasses} 
          onSaveActual={handleSaveActualInvestments} 
          onReset={handleReset} 
        />
      )
    }
  ];

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Diagrama do Cerrado</h1>
      <p className="text-lg mb-8">
        Ferramenta para cálculo de distribuição de investimentos usando o método do Diagrama do Cerrado
      </p>
      
      <Timeline 
        steps={timelineSteps} 
        currentStep={currentStep} 
      />
    </main>
  );
}
