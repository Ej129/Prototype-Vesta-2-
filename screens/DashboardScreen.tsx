
import React from 'react';
import { NavigateTo, Screen, User } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';

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
}

const StatusBadge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
    <div className="flex items-center">
        <span className={`w-2 h-2 rounded-full mr-2`} style={{ backgroundColor: color }}></span>
        <span className="text-sm font-medium" style={{ color }}>{text}</span>
    </div>
);

const AnalysisCard: React.FC<CardProps> = ({ title, subtitle, status, statusColor, action }) => (
    <div 
        onClick={action}
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
        <div>
            <h3 className="font-bold text-lg text-vesta-primary">{title}</h3>
            <p className="text-sm text-vesta-text-light mt-1">{subtitle}</p>
        </div>
        <div className="mt-6">
            <StatusBadge text={status} color={statusColor} />
        </div>
    </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigateTo, currentUser, onLogout }) => {
  const recentAnalyses = [
    {
      title: "Q3 Mobile Banking App Relaunch",
      subtitle: "Analyzed Aug 8, 2025",
      status: "3 Critical Issues",
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

  return (
    <SidebarMainLayout navigateTo={navigateTo} activeScreen={Screen.Dashboard} currentUser={currentUser} onLogout={onLogout}>
      <Header title={`Welcome, ${currentUser.name}`} />
      <div className="p-8">
        <button 
          onClick={() => navigateTo(Screen.Upload)}
          className="bg-vesta-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200"
        >
          + Start New Analysis
        </button>

        <h2 className="text-xl font-bold text-vesta-text mt-10 mb-5">Recent Analyses</h2>
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
