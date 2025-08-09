
import React, { useState, useEffect } from 'react';
import { Screen, NavigateTo, AnalysisReport, User } from './types';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import UploadScreen from './screens/UploadScreen';
import AnalysisInProgressScreen from './screens/AnalysisInProgressScreen';
import ReportScreen from './screens/ReportScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import KnowledgeBaseScreen from './screens/KnowledgeBaseScreen';
import ImprovingScreen from './screens/ImprovingScreen';
import ImprovedReportScreen from './screens/ImprovedReportScreen';
import * as auth from './api/auth';

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.Dashboard);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [planContent, setPlanContent] = useState<string>('');
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [improvedPlanContent, setImprovedPlanContent] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setScreen(Screen.Dashboard);
    } else {
      setScreen(Screen.Login);
    }
  }, []);

  const navigateTo: NavigateTo = (newScreen: Screen) => {
    setScreen(newScreen);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    navigateTo(Screen.Dashboard);
  };
  
  const handleLogout = () => {
    auth.logout();
    setCurrentUser(null);
    setScreen(Screen.Login);
  };

  const handleStartAnalysis = (content: string) => {
    setPlanContent(content);
    navigateTo(Screen.AnalysisInProgress);
  };

  const handleAnalysisComplete = (report: AnalysisReport) => {
    setAnalysisReport(report);
    navigateTo(Screen.Report);
  };

  const handleStartImprovement = () => {
    if (planContent && analysisReport) {
      navigateTo(Screen.Improving);
    }
  };

  const handleImprovementComplete = (improvedContent: string) => {
    setImprovedPlanContent(improvedContent);
    navigateTo(Screen.ImprovedReport);
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.Dashboard:
        return <DashboardScreen navigateTo={navigateTo} currentUser={currentUser!} onLogout={handleLogout} />;
      case Screen.Upload:
        return <UploadScreen navigateTo={navigateTo} onStartAnalysis={handleStartAnalysis} currentUser={currentUser!} onLogout={handleLogout} />;
      case Screen.AnalysisInProgress:
        return <AnalysisInProgressScreen planContent={planContent} onAnalysisComplete={handleAnalysisComplete} />;
      case Screen.Report:
        return <ReportScreen 
                  navigateTo={navigateTo} 
                  report={analysisReport} 
                  currentUser={currentUser!} 
                  onLogout={handleLogout} 
                  planContent={planContent}
                  onStartImprovement={handleStartImprovement}
               />;
      case Screen.Improving:
        return <ImprovingScreen 
                  planContent={planContent!} 
                  analysisReport={analysisReport!} 
                  onImprovementComplete={handleImprovementComplete} 
               />;
      case Screen.ImprovedReport:
        return <ImprovedReportScreen
                  navigateTo={navigateTo}
                  originalContent={planContent!}
                  improvedContent={improvedPlanContent!}
                  currentUser={currentUser!}
                  onLogout={handleLogout}
                />;
      case Screen.AuditTrail:
        return <PlaceholderScreen navigateTo={navigateTo} activeScreen={Screen.AuditTrail} title="Audit Trail" currentUser={currentUser!} onLogout={handleLogout}/>;
      case Screen.KnowledgeBase:
        return <KnowledgeBaseScreen navigateTo={navigateTo} currentUser={currentUser!} onLogout={handleLogout}/>;
      case Screen.Settings:
        return <PlaceholderScreen navigateTo={navigateTo} activeScreen={Screen.Settings} title="Settings" currentUser={currentUser!} onLogout={handleLogout}/>;
      default:
        return <DashboardScreen navigateTo={navigateTo} currentUser={currentUser!} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="font-sans bg-vesta-background min-h-screen text-vesta-text">
      {currentUser ? renderScreen() : <LoginScreen onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}