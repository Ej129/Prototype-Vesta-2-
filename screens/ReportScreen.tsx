
import React, { useState, useMemo } from 'react';
import { NavigateTo, Screen, AnalysisReport, Finding, User } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';
import { SparklesIcon } from '../components/Icons';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface ReportScreenProps {
  navigateTo: NavigateTo;
  report: AnalysisReport | null;
  currentUser: User;
  onLogout: () => void;
  planContent: string | null;
  onStartImprovement: () => void;
}

interface StatCardProps {
  title: string;
  value: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color = 'text-vesta-primary' }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <p className="text-sm text-vesta-text-light font-medium">{title}</p>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

const RiskDonutChart = ({ findings }: { findings: Finding[] }) => {
    const riskData = useMemo(() => {
        const criticalCount = findings.filter(f => f.severity === 'critical').length;
        const warningCount = findings.filter(f => f.severity === 'warning').length;
        
        return [
            { name: 'Critical Issues', value: criticalCount, color: '#D0021B' },
            { name: 'Warnings', value: warningCount, color: '#F5A623' },
        ].filter(item => item.value > 0);
    }, [findings]);

    if (riskData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col justify-center items-center">
                <h3 className="font-bold text-lg text-vesta-primary mb-4">No Risks Detected</h3>
                <p className="text-vesta-text-light">The analysis did not find any critical issues or warnings.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
            <h3 className="font-bold text-lg text-vesta-primary mb-4">Risks by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={riskData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                    >
                        {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ bottom: 0 }} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

interface AccordionItemProps {
    finding: Finding;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ finding, isOpen, onClick }) => {
    const severityClasses = {
        critical: {
            bg: 'bg-vesta-accent-critical/10',
            border: 'border-vesta-accent-critical',
            text: 'text-vesta-accent-critical'
        },
        warning: {
            bg: 'bg-vesta-accent-warning/10',
            border: 'border-vesta-accent-warning',
            text: 'text-vesta-accent-warning'
        }
    };
    const classes = severityClasses[finding.severity];

    return (
        <div className={`border-l-4 rounded-r-lg ${classes.border} ${classes.bg}`}>
            <button onClick={onClick} className="w-full flex justify-between items-center p-4 text-left">
                <span className="font-semibold text-vesta-primary flex-1 pr-4">{finding.title}</span>
                <div className='flex items-center flex-shrink-0'>
                    <span className={`text-sm font-bold uppercase mr-4 ${classes.text}`}>{finding.severity}</span>
                    <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200/50">
                     <div className="space-y-4 text-sm">
                        <div>
                            <p className="font-semibold text-vesta-text-light mb-1">Source Text Snippet:</p>
                            <blockquote className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 italic text-vesta-text">"{finding.sourceSnippet}"</blockquote>
                        </div>
                        <div>
                            <p className="font-semibold text-vesta-text-light mb-1">Vesta's Recommendation:</p>
                            <p className="text-vesta-text-light leading-relaxed">{finding.recommendation}</p>
                        </div>
                        <div className="flex space-x-3 pt-2">
                            <button className="px-4 py-2 text-sm font-semibold text-white bg-vesta-accent-success rounded-lg hover:bg-opacity-90">Mark as Resolved</button>
                            <button className="px-4 py-2 text-sm font-semibold text-vesta-text-light bg-gray-200 rounded-lg hover:bg-gray-300">Dismiss</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ReportScreen: React.FC<ReportScreenProps> = ({ navigateTo, report, currentUser, onLogout, planContent, onStartImprovement }) => {
    const [openAccordionId, setOpenAccordionId] = useState<string | null>(report?.findings[0]?.id ?? null);
    
    const toggleAccordion = (id: string) => {
        setOpenAccordionId(openAccordionId === id ? null : id);
    };

    if (!report) {
        return (
            <SidebarMainLayout navigateTo={navigateTo} activeScreen={Screen.Dashboard} currentUser={currentUser} onLogout={onLogout}>
                <Header title="Analysis Report" />
                <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-vesta-primary">No report data available.</h2>
                    <p className="text-vesta-text-light mt-2">Please start a new analysis to view a report.</p>
                    <button onClick={() => navigateTo(Screen.Upload)} className="mt-6 bg-vesta-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all">
                        Start New Analysis
                    </button>
                </div>
            </SidebarMainLayout>
        );
    }
    
    const canImprove = report && report.findings.length > 0 && planContent;

    return (
        <SidebarMainLayout navigateTo={navigateTo} activeScreen={Screen.Dashboard} currentUser={currentUser} onLogout={onLogout}>
            <Header title={`Analysis for: ${report.title}`} showExportButton />
            <div className="p-8 space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-vesta-text">Executive Summary</h2>
                        {canImprove && (
                            <button 
                                onClick={onStartImprovement}
                                className="flex items-center justify-center px-6 py-2 bg-vesta-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-all duration-200"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                Auto-Improve Document
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Resilience Score" value={`${report.resilienceScore}%`} />
                        <StatCard title="Critical Issues" value={String(report.summary.critical)} color="text-vesta-accent-critical" />
                        <StatCard title="Warnings" value={String(report.summary.warning)} color="text-vesta-accent-warning" />
                        <StatCard title="Checks Performed" value={report.summary.checks.toLocaleString()} />
                    </div>
                </div>

                <RiskDonutChart findings={report.findings} />

                <div>
                    <h2 className="text-xl font-bold text-vesta-text mb-4">Detailed Findings</h2>
                    <div className="space-y-4">
                        {report.findings.length > 0 ? report.findings.map(finding => (
                            <AccordionItem 
                                key={finding.id}
                                finding={finding}
                                isOpen={openAccordionId === finding.id} 
                                onClick={() => toggleAccordion(finding.id)}
                            />
                        )) : (
                            <div className="bg-white p-8 rounded-lg shadow-md text-center border border-border-color">
                                <h3 className="text-lg font-semibold text-vesta-primary">No Findings</h3>
                                <p className="mt-2 text-vesta-text-light">Congratulations! The analysis did not uncover any issues in your document.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarMainLayout>
    );
};

export default ReportScreen;