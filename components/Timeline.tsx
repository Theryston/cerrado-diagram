import React from 'react';
import { Check, CircleSlash } from 'lucide-react';

export interface TimelineStep {
  id: string;
  title: string;
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
        const isPrevious = steps.findIndex(s => s.id === currentStep) > index;
        
        let dotClass = 'timeline-dot ';
        let stepClass = '';
        
        if (step.isComplete) {
          dotClass += 'timeline-dot-complete';
          stepClass = 'step-complete';
        } else if (isActive) {
          dotClass += 'timeline-dot-current';
          stepClass = 'step-current';
        } else {
          dotClass += 'timeline-dot-inactive';
          stepClass = 'step-inactive';
        }
        
        const isDisabled = !step.isComplete && !isActive && !isPrevious;
        
        return (
          <div key={step.id} className="timeline-item">
            <div className={dotClass}>
              {step.isComplete ? <Check size={16} /> : index + 1}
            </div>
            
            <div className={`border rounded-lg p-4 ${stepClass} ${isDisabled ? 'pointer-events-none' : ''}`}>
              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
              {/* Only render content if it's complete or active */}
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