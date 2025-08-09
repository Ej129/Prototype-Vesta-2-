import React, { useState, useEffect, useCallback } from 'react';
import { Screen, NavigateTo, AnalysisReport, User, AuditLog, AuditLogAction, KnowledgeSource, DismissalRule, FeedbackReason, Finding } from './types';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import AuditTrailScreen from './screens/AuditTrailScreen';
import KnowledgeBaseScreen from './screens/KnowledgeBaseScreen';
import SettingsScreen from './screens/SettingsScreen';
import * as auth from './api/auth';
import { TourProvider, useTour } from './contexts/TourContext';
import { sampleReportForTour } from './data/sample-report';

const AppContainer = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Login);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [activeReport, setActiveReport] = useState<AnalysisReport | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [knowledgeBaseSources, setKnowledgeBaseSources] = useState<KnowledgeSource[]>([]);
  const [dismissalRules, setDismissalRules] = useState<DismissalRule[]>([]);
  
  const tour = useTour();

  const navigateTo: NavigateTo = (newScreen: Screen) => {
    setScreen(newScreen);
  };
  
  useEffect(() => {
    const savedSources = localStorage.getItem('vesta-knowledge-sources');
    if (savedSources) {
      setKnowledgeBaseSources(JSON.parse(savedSources));
    }
    const savedRules = localStorage.getItem('vesta-dismissal-rules');
    if (savedRules) {
      setDismissalRules(JSON.parse(savedRules));
    }
  }, []);
  
  const addAuditLog = useCallback((action: AuditLogAction, details: string) => {
    if(!currentUser) return;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: currentUser.email,
      action,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser]);
  
  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setScreen(Screen.Dashboard);
      
      const isFirstVisit = !localStorage.getItem('vesta-tour-completed');
      if (isFirstVisit && tour) {
        setTimeout(() => tour.startTour(), 1000);
      }
    } else {
      setScreen(Screen.Login);
    }
  }, []);

  const handleLoginSuccess = (user: User, isSocialLogin: boolean = false) => {
    const isFirstVisit = !localStorage.getItem('vesta-tour-completed');
    
    setCurrentUser(user);
    addAuditLog(isSocialLogin ? 'Social Login' : 'User Login', `User ${user.email} logged in.`);
    navigateTo(Screen.Dashboard);

    if (isFirstVisit && tour) {
      setTimeout(() => tour.startTour(), 1000); // Delay to allow dashboard to render
    }
  };
  
  const handleLogout = () => {
    if (currentUser) {
        addAuditLog('User Logout', `User ${currentUser.email} logged out.`);
    }
    auth.logout();
    setCurrentUser(null);
    setScreen(Screen.Login);
  };

  const handleStartNewAnalysis = () => {
    if (tour && tour.isActive && tour.currentStep === 0) {
      setActiveReport(sampleReportForTour);
      navigateTo(Screen.Analysis);
      setTimeout(() => tour.nextStep(), 500); // Give analysis screen time to mount
    } else {
      setActiveReport(null);
      navigateTo(Screen.Analysis);
    }
  };

  const handleSelectReport = (report: AnalysisReport) => {
    setActiveReport(report);
    navigateTo(Screen.Analysis);
  };

  const handleAnalysisComplete = (report: AnalysisReport) => {
    if (!reports.some(r => r.title === report.title)) {
      setReports(prev => [report, ...prev]);
    }
    addAuditLog('Analysis Run', `Analysis completed for: ${report.title}`);
    setActiveReport(report);
  };

  const addKnowledgeSource = (title: string, content: string) => {
    const newSource: KnowledgeSource = { id: `kb-${Date.now()}`, title, content };
    setKnowledgeBaseSources(prev => {
      const updated = [...prev, newSource];
      localStorage.setItem('vesta-knowledge-sources', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteKnowledgeSource = (id: string) => {
    setKnowledgeBaseSources(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('vesta-knowledge-sources', JSON.stringify(updated));
      return updated;
    });
  };

  const addDismissalRule = (finding: Finding, reason: FeedbackReason) => {
    const newRule: DismissalRule = {
      id: `rule-${Date.now()}`,
      findingTitle: finding.title,
      reason,
      timestamp: new Date().toISOString(),
    };
    setDismissalRules(prev => {
      const updated = [...prev, newRule];
      localStorage.setItem('vesta-dismissal-rules', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteDismissalRule = (id: string) => {
    setDismissalRules(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('vesta-dismissal-rules', JSON.stringify(updated));
      return updated;
    });
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.Dashboard:
        return <DashboardScreen 
                  navigateTo={navigateTo} 
                  currentUser={currentUser!} 
                  onLogout={handleLogout} 
                  reports={reports}
                  onSelectReport={handleSelectReport}
                  onStartNewAnalysis={handleStartNewAnalysis}
               />;
      case Screen.Analysis:
        return <AnalysisScreen
                  navigateTo={navigateTo}
                  currentUser={currentUser!}
                  onLogout={handleLogout}
                  activeReport={activeReport}
                  onAnalysisComplete={handleAnalysisComplete}
                  addAuditLog={addAuditLog}
                  knowledgeBaseSources={knowledgeBaseSources}
                  dismissalRules={dismissalRules}
                  onAddDismissalRule={addDismissalRule}
                />;
      case Screen.AuditTrail:
        return <AuditTrailScreen navigateTo={navigateTo} currentUser={currentUser!} onLogout={handleLogout} logs={auditLogs} />;
      case Screen.KnowledgeBase:
        return <KnowledgeBaseScreen navigateTo={navigateTo} currentUser={currentUser!} onLogout={handleLogout} sources={knowledgeBaseSources} onAddSource={addKnowledgeSource} onDeleteSource={deleteKnowledgeSource}/>;
      case Screen.Settings:
        return <SettingsScreen navigateTo={navigateTo} currentUser={currentUser!} onLogout={handleLogout} dismissalRules={dismissalRules} onDeleteDismissalRule={deleteDismissalRule} />;
      default:
        return <DashboardScreen 
                  navigateTo={navigateTo} 
                  currentUser={currentUser!} 
                  onLogout={handleLogout} 
                  reports={reports}
                  onSelectReport={handleSelectReport}
                  onStartNewAnalysis={handleStartNewAnalysis}
                />;
    }
  };

  return (
    <div className="font-sans bg-light-main dark:bg-dark-main min-h-screen text-primary-text-light dark:text-primary-text-dark">
      {currentUser ? renderScreen() : <LoginScreen onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default function App() {
  return (
      <TourProvider>
        <AppContainer />
      </TourProvider>
  );
}