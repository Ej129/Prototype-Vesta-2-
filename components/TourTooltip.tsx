import React, { useLayoutEffect, useState, useRef } from 'react';

interface TourTooltipProps {
  step: number;
  totalSteps: number;
  targetSelector: string;
  text: string;
  onNext: () => void;
  onBack: () => void;
  onEnd: () => void;
  isLastStep?: boolean;
}

const TourTooltip: React.FC<TourTooltipProps> = ({ step, totalSteps, targetSelector, text, onNext, onBack, onEnd, isLastStep = false }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      // Scroll into view if needed
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [targetSelector, step]); // Rerun when step changes to find new element
  
  const getTooltipPosition = () => {
    if(!tooltipRef.current || !window) return {};
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const spaceBelow = window.innerHeight - (position.top + position.height);

    if (spaceBelow > tooltipHeight + 20) {
      // Position below the element
      return { top: `${position.top + position.height + 10}px`, left: `${position.left}px` };
    } else {
      // Position above the element
      return { top: `${position.top - tooltipHeight - 10}px`, left: `${position.left}px` };
    }
  };


  if (position.width === 0) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div 
        className="absolute rounded-lg"
        style={{
            top: `${position.top - 4}px`,
            left: `${position.left - 4}px`,
            width: `${position.width + 8}px`,
            height: `${position.height + 8}px`,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
            transition: 'all 0.3s ease-out',
            pointerEvents: 'none',
        }}
      ></div>
      <div
        ref={tooltipRef}
        className="absolute bg-white dark:bg-gray-800 text-vesta-text dark:text-gray-200 rounded-lg shadow-xl p-4 w-80 z-[101] transform transition-all animate-fade-in-up"
        style={getTooltipPosition()}
        role="dialog"
        aria-labelledby="tour-tooltip-text"
      >
        <p id="tour-tooltip-text" className="text-sm mb-4">{text}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400">{step}/{totalSteps}</span>
          <div className="space-x-2">
            {step > 1 && (
                <button onClick={onBack} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-vesta-primary dark:hover:text-vesta-secondary px-2 py-1">Back</button>
            )}
            <button onClick={onEnd} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-vesta-primary dark:hover:text-vesta-secondary px-2 py-1">Skip</button>
            <button onClick={onNext} className="bg-vesta-primary text-white text-sm font-bold py-1 px-3 rounded-md hover:bg-opacity-90">
              {isLastStep ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TourTooltip;
