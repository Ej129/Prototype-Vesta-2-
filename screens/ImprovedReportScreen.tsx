
import React, { useState } from 'react';
import { NavigateTo, Screen, User } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';
import { DownloadIcon } from '../components/Icons';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';


interface ImprovedReportScreenProps {
  navigateTo: NavigateTo;
  originalContent: string;
  improvedContent: string;
  currentUser: User;
  onLogout: () => void;
}

const ImprovedReportScreen: React.FC<ImprovedReportScreenProps> = ({ navigateTo, originalContent, improvedContent, currentUser, onLogout }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(improvedContent);
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
    };
    
    const downloadFile = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDownloadOpen(false);
    };
    
    const handleDownloadTXT = (e: React.MouseEvent) => {
        e.preventDefault();
        const blob = new Blob([improvedContent], { type: 'text/plain;charset=utf-8' });
        downloadFile(blob, 'improved-plan.txt');
    };
    
    const handleDownloadPDF = (e: React.MouseEvent) => {
        e.preventDefault();
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const lines = doc.splitTextToSize(improvedContent, pageWidth - margin * 2);
        
        let y = margin;
        for (let i = 0; i < lines.length; i++) {
            if (y > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
            doc.text(lines[i], margin, y);
            y += 7; // line height
        }
        
        doc.save('improved-plan.pdf');
        setIsDownloadOpen(false);
    };
    
    const handleDownloadDOCX = (e: React.MouseEvent) => {
        e.preventDefault();
        const doc = new Document({
            sections: [{
                children: improvedContent.split('\n').map(text => 
                    new Paragraph({
                        children: [new TextRun(text)]
                    })
                ),
            }],
        });
    
        Packer.toBlob(doc).then(blob => {
            downloadFile(blob, 'improved-plan.docx');
        });
    };

    return (
        <SidebarMainLayout navigateTo={navigateTo} activeScreen={Screen.Dashboard} currentUser={currentUser} onLogout={onLogout}>
            <Header title="Improved Document" />
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-vesta-text dark:text-gray-200">Comparison View</h2>
                        <p className="text-vesta-text-light dark:text-gray-400">Review the changes and copy the improved version.</p>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleCopy}
                            className="bg-vesta-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 min-w-[160px]"
                        >
                            {copyButtonText}
                        </button>
                        
                        <div className="relative inline-block text-left ml-4">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setIsDownloadOpen(prev => !prev)}
                                    className="bg-vesta-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 inline-flex items-center justify-center"
                                    id="options-menu"
                                    aria-haspopup="true"
                                    aria-expanded={isDownloadOpen}
                                >
                                    <DownloadIcon className="w-5 h-5 mr-2" />
                                    Download
                                </button>
                            </div>

                            {isDownloadOpen && (
                                <div 
                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 z-10"
                                >
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <a href="#" onClick={handleDownloadPDF} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">
                                            Download as PDF (.pdf)
                                        </a>
                                        <a href="#" onClick={handleDownloadDOCX} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">
                                            Download as Word (.docx)
                                        </a>
                                        <a href="#" onClick={handleDownloadTXT} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">
                                            Download as Text (.txt)
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigateTo(Screen.Dashboard)}
                            className="ml-4 bg-gray-200 dark:bg-gray-600 text-vesta-text-light dark:text-gray-300 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                        >
                            Finish
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-vesta-primary dark:text-gray-300 mb-2">Original Plan</h3>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-vesta-border dark:border-gray-700 h-[65vh] overflow-y-auto whitespace-pre-wrap font-mono text-sm text-vesta-text-light dark:text-gray-300">
                            {originalContent}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-vesta-accent-success mb-2">Vesta's Improved Plan</h3>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-vesta-accent-success h-[65vh] overflow-y-auto whitespace-pre-wrap font-mono text-sm text-vesta-text dark:text-gray-200">
                            {improvedContent}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarMainLayout>
    );
};

export default ImprovedReportScreen;