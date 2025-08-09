import React, { createContext, useState, useContext, useEffect } from 'react';
import { AnalysisReport, NavigateTo, Screen } from '../types';

// Sample report data for the tour
const sampleReport: AnalysisReport = {
  title: "Sample: Q3 Mobile Banking App Relaunch",
  resilienceScore: 72,
  summary: {
    critical: 1,
    warning: 2,
    checks: 1347,
  },
  findings: [
    {
      id: 'tour-finding-1',
      severity: 'critical',
      title: 'No explicit consent mechanism for data collection',
      sourceSnippet: 'User data will be collected upon registration to enhance their experience.',
      recommendation: 'Implement a mandatory checkbox for users to explicitly agree to the Terms of Service and Privacy Policy before account creation, in compliance with the Data Privacy Act (RA 10173).',
    },
    {
      id: 'tour-finding-2',
      severity: 'warning',
      title: 'Vague language on third-party data sharing',
      sourceSnippet: 'We may share information with our partners to offer better services.',
      recommendation: 'Specify which categories of partners data may be shared with and for what exact purposes. Provide a link to a list of third-party services.',
    },
    {
      id: 'tour-finding-3',
      severity: 'warning',
      title: 'Disaster recovery plan lacks specific RTO/RPO',
      sourceSnippet: 'Systems will be restored as soon as possible in the event of an outage.',
      recommendation: 'Define specific Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) for critical systems, as per BSP Circular No. 808 guidelines on IT risk management.',
    },
  ],
};

const tourStepsConfig = (navigateTo: NavigateTo) => [
  {
    targetSelector: '#new-analysis-button',
    text: "When you're ready, this is where you will upload your own project plans to be analyzed.",
    screen: Screen.Dashboard,
  },
  {
    targetSelector: '#sample-analysis-card',
    text: "We've already created a sample analysis for you. Let's look at the report to see what Vesta can do.",
    screen: Screen.Dashboard,
    onNextAction: () => navigateTo(Screen.Report)
  },
  {
    targetSelector: '#executive-summary',
    text: "Here is the executive summary. You can immediately see the project's overall Resilience Score, and the number of critical issues and warnings found.",
    screen: Screen.Report,
  },
  {
    targetSelector: '#detailed-findings',
    text: "Vesta provides detailed, actionable recommendations for each finding. Click on any item to expand it.",
    screen: Screen.Report,
  },
];


interface TourStepConfig {
    targetSelector: string;
    text: string;
    screen: Screen;
    onNextAction?: () => void;
}
interface TourContextType {
  isTourActive: boolean;
  tourStep: number;
  showWelcomeModal: boolean;
  sampleReport: AnalysisReport;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  backStep: () => void;
  currentStepConfig: TourStepConfig | undefined;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children, navigateTo }: { children: React.ReactNode, navigateTo: NavigateTo }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(1);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const steps = tourStepsConfig(navigateTo);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('vesta-tour-completed');
    if (!tourCompleted) {
      // Small delay to ensure the dashboard has rendered
      setTimeout(() => setShowWelcomeModal(true), 500);
    }
  }, []);

  const startTour = () => {
    setShowWelcomeModal(false);
    setIsTourActive(true);
    setTourStep(1);
    if (steps[0].screen) {
        navigateTo(steps[0].screen);
    }
  };

  const endTour = () => {
    setShowWelcomeModal(false);
    setIsTourActive(false);
    localStorage.setItem('vesta-tour-completed', 'true');
  };

  const nextStep = () => {
    const currentConfig = steps[tourStep - 1];
    if (currentConfig.onNextAction) {
        currentConfig.onNextAction();
    }

    if (tourStep < steps.length) {
      setTourStep(prev => prev + 1);
    } else {
      endTour();
    }
  };
  
  const backStep = () => {
    if (tourStep > 1) {
        const prevStepConfig = steps[tourStep - 2];
        if (prevStepConfig.screen !== steps[tourStep-1].screen) {
            navigateTo(prevStepConfig.screen);
        }
        setTourStep(prev => prev - 1);
    }
  };
  
  const value = {
    isTourActive,
    tourStep,
    showWelcomeModal,
    sampleReport,
    startTour,
    endTour,
    nextStep,
    backStep,
    currentStepConfig: isTourActive ? steps[tourStep - 1] : undefined,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
