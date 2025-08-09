
import React, { useEffect, useState } from 'react';
import { AnalysisReport } from '../types';
import { CenteredLayout } from '../components/Layout';
import { SparklesIcon } from '../components/Icons';
import { improvePlan } from '../api/vesta';

interface ImprovingScreenProps {
  planContent: string;
  analysisReport: AnalysisReport;
  onImprovementComplete: (improvedContent: string) => void;
}

const improvementSteps = [
  'Applying recommendations to the document...',
  'Restructuring sections for clarity...',
  'Enhancing language for professional tone...',
  'Performing final consistency check...',
  'Finalizing the improved document...',
];

const ImprovingScreen: React.FC<ImprovingScreenProps> = ({ planContent, analysisReport, onImprovementComplete }) => {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    improvePlan(planContent, analysisReport).then(improvedContent => {
        onImprovementComplete(improvedContent);
    });

    const stepsInterval = setInterval(() => {
        setVisibleSteps(prev => {
            if (prev < improvementSteps.length) {
                return prev + 1;
            }
            clearInterval(stepsInterval);
            return prev;
        });
    }, 700);

    return () => {
      clearInterval(stepsInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planContent, analysisReport, onImprovementComplete]);

  return (
    <CenteredLayout>
      <div className="w-full max-w-lg text-center">
        <div className="relative w-16 h-16 mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-vesta-secondary"></div>
            <SparklesIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-vesta-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-vesta-primary dark:text-gray-100 mt-8">
          Vesta is improving your document...
        </h2>
        <div id="improvementSteps" className="mt-6 text-left inline-block">
          <ul className="space-y-3">
            {improvementSteps.map((step, index) => (
              <li key={index} 
                  className={`flex items-center transition-opacity duration-500 ${index < visibleSteps ? 'opacity-100' : 'opacity-0'}`}>
                <SparklesIcon className="w-5 h-5 text-vesta-secondary mr-3" />
                <span className="text-vesta-text-light dark:text-gray-400">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CenteredLayout>
  );
};

export default ImprovingScreen;