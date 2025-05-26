interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex mb-6">
      {steps.map((label, idx) => {
        const stepNumber = idx + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div
            key={label}
            className={`flex-1 cursor-pointer text-center pb-2 border-b-4 ${
              isActive
                ? "border-blue-600 font-bold text-blue-600"
                : isCompleted
                ? "border-green-600 text-green-600"
                : "border-gray-300 text-gray-400"
            }`}
            onClick={() => onStepClick && onStepClick(stepNumber)}
          >
            <div className="mb-1">{label}</div>
            <div
              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isCompleted
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {stepNumber}
            </div>
          </div>
        );
      })}
    </div>
  );
}
