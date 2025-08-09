import React from 'react';
import { NavigateTo, Screen, User } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';
import { useTour } from '../contexts/TourContext';
import WelcomeModal from '../components/WelcomeModal';
import TourTooltip from '../components/TourTooltip';


interface DashboardScreenProps {
  navigateTo: NavigateTo;
  currentUser: User;
  onLogout: () => void;
}

interface CardProps {
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  action: () => void;
  id?: string;
}

const StatusBadge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
    <div className="flex items-center">
        <span className={`w-2 h-2 rounded-full mr-2`} style={{ backgroundColor: color }}></span>
        <span className="text-sm font-medium" style={{ color }}>{text}</span>
    </div>
);

const AnalysisCard: React.FC<CardProps> = ({ title, subtitle, status, statusColor, action, id }) => (
    <div 
        id={id}
        onClick={action}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl dark:hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
        <div>
            <h3 className="font-bold text-lg text-vesta-primary dark:text-vesta-secondary">{title}</h3>
            <p className="text-sm text-vesta-text-light dark:text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className="mt-6">
            <StatusBadge text={status} color={statusColor} />
        </div>
    </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigateTo, currentUser, onLogout }) => {
  const { 
    isTourActive, 
    tourStep, 
    showWelcomeModal, 
    startTour, 
    endTour, 
    nextStep,
    backStep, 
    currentStepConfig 
  } = useTour();
  
  const recentAnalyses = [
    {
      id: "sample-analysis-card",
      title: "Sample: Q3 Mobile Banking App Relaunch",
      subtitle: "Analyzed Aug 10, 2025",
      status: "1 Critical Issue",
      statusColor: "#D0021B", // accent-critical
      action: () => navigateTo(Screen.Report)
    },
    {
      title: "Digital Onboarding Revamp",
      subtitle: "Analyzed Aug 7, 2025",
      status: "8 Warnings",
      statusColor: "#F5A623", // accent-warning
      action: () => navigateTo(Screen.Report)
    },
    {
      title: "Internal Process Automation",
      subtitle: "Analyzed Aug 5, 2025",
      status: "Vetted & Approved",
      statusColor: "#28A745", // accent-success
      action: () => navigateTo(Screen.Report)
    },
  ];

  const handleStartTour = () => {
    startTour();
    // Ensure the sample report is used for the tour's navigation
    const sampleCard = recentAnalyses.find(r => r.id === 'sample-analysis-card');
    if (sampleCard) {
      sampleCard.action = () => nextStep();
    }
  }

  return (
    <SidebarMainLayout navigateTo={navigateTo} activeScreen={Screen.Dashboard} currentUser={currentUser} onLogout={onLogout}>
      {showWelcomeModal && <WelcomeModal onStartTour={handleStartTour} onSkipTour={endTour} />}
      {isTourActive && currentStepConfig && currentStepConfig.screen === Screen.Dashboard && (
          <TourTooltip 
              step={tourStep}
              totalSteps={4}
              targetSelector={currentStepConfig.targetSelector}
              text={currentStepConfig.text}
              onNext={nextStep}
              onBack={backStep}
              onEnd={endTour}
          />
      )}
      <Header title={`Welcome, ${currentUser.name}`} />
      <div className="p-8">
        <button 
          id="new-analysis-button"
          onClick={() => navigateTo(Screen.Upload)}
          className="bg-vesta-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200"
        >
          + Start New Analysis
        </button>

        <h2 className="text-xl font-bold text-vesta-text dark:text-gray-200 mt-10 mb-5">Recent Analyses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentAnalyses.map(card => (
            <AnalysisCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </SidebarMainLayout>
  );
};

export default DashboardScreen;
