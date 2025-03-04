import React from "react";
import { Check, CircleSlash, ChevronDown, ChevronUp } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { AssetClassForm } from "./AssetClassForm";
import { AssetForm } from "./AssetForm";
import { ContributionForm } from "./ContributionForm";
import { InvestmentResults } from "./InvestmentResults";
import { useGlobal } from "@/app/context";

export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  isComplete: boolean;
}

export function Timeline() {
  const { completedSteps, currentStep, expandedSteps, setExpandedSteps } =
    useGlobal();

  const steps: TimelineStep[] = [
    {
      id: STEPS.ASSET_CLASSES,
      title: "1. Classes de Ativos",
      description:
        "Defina as classes de ativos que deseja incluir no seu diagrama e o percentual para cada classe.",
      isComplete: completedSteps[STEPS.ASSET_CLASSES],
      content: <AssetClassForm />,
    },
    {
      id: STEPS.ASSETS,
      title: "2. Ativos",
      description:
        "Defina os ativos que você deseja incluir no seu diagrama e a quantidade que você tem de cada ativo. (OBS: Se você não tem um ativo, você pode inserir o valor 0)",
      isComplete: completedSteps[STEPS.ASSETS],
      content: <AssetForm />,
    },
    {
      id: STEPS.CONTRIBUTION,
      title: "3. Aporte",
      description:
        "Defina o valor que você deseja investir, e o diagrama calculará a quantidade de cada ativo para você.",
      isComplete: completedSteps[STEPS.CONTRIBUTION],
      content: <ContributionForm />,
    },
    {
      id: STEPS.RESULTS,
      title: "4. Resultado",
      isComplete: completedSteps[STEPS.RESULTS],
      content: <InvestmentResults />,
    },
  ];

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  return (
    <div className="relative mt-8">
      <div className="timeline-connector" />

      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isPrevious = steps.findIndex((s) => s.id === currentStep) > index;
        const isExpanded = expandedSteps[step.id];

        let dotClass = "timeline-dot ";
        let stepClass = "";

        if (step.isComplete) {
          dotClass += "timeline-dot-complete";
          stepClass = "step-complete";
        } else if (isActive) {
          dotClass += "timeline-dot-current";
          stepClass = "step-current";
        } else {
          dotClass += "timeline-dot-inactive";
          stepClass = "step-inactive";
        }

        const anyPreviousStepIncomplete = steps
          .slice(0, index)
          .some((s) => !s.isComplete);
        const isDisabled =
          (!step.isComplete && !isActive && !isPrevious) ||
          (index > 0 && anyPreviousStepIncomplete);
        const isClickable =
          (step.isComplete || isActive || isPrevious) &&
          !anyPreviousStepIncomplete;

        return (
          <div key={step.id} className="timeline-item">
            <div className={dotClass}>
              {step.isComplete ? <Check size={16} /> : index + 1}
            </div>

            <div
              className={`rounded-lg ${stepClass} ${
                isDisabled ? "pointer-events-none" : ""
              }`}
              id={step.id}
            >
              <div
                className={`flex justify-between items-center ${isClickable ? "cursor-pointer" : ""}`}
                onClick={() => isClickable && toggleStepExpansion(step.id)}
              >
                <h3 className="text-lg font-medium">{step.title}</h3>
                {isClickable && (
                  <button
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={
                      isExpanded ? "Minimizar passo" : "Expandir passo"
                    }
                  >
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                )}
              </div>

              {isClickable && step.description && (
                <p className="text-sm text-gray-500 mb-2">{step.description}</p>
              )}

              {isClickable && isExpanded && step.content}

              {isDisabled && (
                <div className="flex items-center text-gray-500">
                  <CircleSlash size={16} className="mr-2" />
                  <span>Complete os passos anteriores</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
