import React from "react";
import { Check, CircleSlash } from "lucide-react";

export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  isComplete: boolean;
}

interface TimelineProps {
  steps: TimelineStep[];
  currentStep: string;
}

export function Timeline({ steps, currentStep }: TimelineProps) {
  return (
    <div className="relative mt-8">
      <div className="timeline-connector" />

      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isPrevious = steps.findIndex((s) => s.id === currentStep) > index;

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

        const isDisabled = !step.isComplete && !isActive && !isPrevious;

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
              <h3 className="text-lg font-medium">{step.title}</h3>
              {(step.isComplete || isActive || isPrevious) &&
                step.description && (
                  <p className="text-sm text-gray-500 mb-2">
                    {step.description}
                  </p>
                )}

              {(step.isComplete || isActive || isPrevious) && step.content}

              {isDisabled && (
                <div className="flex items-center text-gray-500">
                  <CircleSlash size={16} className="mr-2" />
                  <span>Complete previous steps first</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
