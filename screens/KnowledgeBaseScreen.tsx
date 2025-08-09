
import React, { useState } from 'react';
import { NavigateTo, Screen, User } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';
import { PlusIcon, GlobeIcon, RefreshIcon, TrashIcon } from '../components/Icons';

interface KnowledgeBaseScreenProps {
  navigateTo: NavigateTo;
  currentUser: User;
  onLogout: () => void;
}

interface KnowledgeSource {
  id: number;
  url: string;
  addedDate: string;
  status: 'Active' | 'Crawling';
}

const initialSources: KnowledgeSource[] = [
    { id: 1, url: 'https://www.bsp.gov.ph/Pages/Regulations/LawsAndIssuances.aspx', addedDate: 'Aug 01, 2025', status: 'Active' },
    { id: 2, url: 'https://www.privacy.gov.ph/data-privacy-act/', addedDate: 'Jul 28, 2025', status: 'Active' },
];


const KnowledgeBaseScreen: React.FC<KnowledgeBaseScreenProps> = ({ navigateTo, currentUser, onLogout }) => {
    const [sources, setSources] = useState<KnowledgeSource[]>(initialSources);
    const [newUrl, setNewUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddSource = () => {
        if (!newUrl.trim()) return;
        
        const crawlingSource: KnowledgeSource = {
            id: Date.now(),
            url: newUrl,
            addedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: 'Crawling',
        };
        
        setSources(prev => [crawlingSource, ...prev]);
        setNewUrl('');
        setIsAdding(true);
        
        setTimeout(() => {
            setSources(prev => prev.map(s => s.id === crawlingSource.id ? { ...s, status: 'Active' } : s));
            setIsAdding(false);
        }, 2500); // Simulate crawling/processing time
    };

    const handleDeleteSource = (id: number) => {
        setSources(prev => prev.filter(source => source.id !== id));
    };
    
  return (
    <SidebarMainLayout navigateTo={navigateTo} activeScreen={Screen.KnowledgeBase} currentUser={currentUser} onLogout={onLogout}>
      <Header title="Knowledge Base" />
      <div className="p-8 space-y-8">
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-vesta-border dark:border-gray-700">
            <h3 className="text-lg font-bold text-vesta-primary dark:text-gray-200 mb-4">Add New Regulatory Source</h3>
            <div className="flex items-center space-x-4">
                <div className="relative flex-grow">
                    <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://www.example-regulator.gov/documents/..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-vesta-secondary bg-white dark:bg-gray-700 dark:text-gray-100"
                        disabled={isAdding}
                    />
                </div>
                <button 
                    onClick={handleAddSource}
                    disabled={isAdding || !newUrl.trim()}
                    className="flex items-center justify-center px-6 py-2 bg-vesta-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:bg-opacity-50 disabled:cursor-not-allowed w-36"
                >
                    {isAdding ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Adding...
                        </>
                    ) : (
                        <>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Source
                        </>
                    )}
                </button>
            </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-vesta-text dark:text-gray-200 mb-4">Managed Sources</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-vesta-border dark:border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-vesta-border dark:border-gray-700">
                <tr>
                  <th className="p-4 font-semibold text-vesta-text-light dark:text-gray-400 text-sm">Source URL</th>
                  <th className="p-4 font-semibold text-vesta-text-light dark:text-gray-400 text-sm">Date Added</th>
                  <th className="p-4 font-semibold text-vesta-text-light dark:text-gray-400 text-sm">Status</th>
                  <th className="p-4 font-semibold text-vesta-text-light dark:text-gray-400 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source, index) => (
                  <tr key={source.id} className="border-b border-vesta-border dark:border-gray-700 last:border-b-0">
                    <td className="p-4 text-vesta-primary dark:text-vesta-secondary font-medium truncate max-w-sm">
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{source.url}</a>
                    </td>
                    <td className="p-4 text-vesta-text-light dark:text-gray-400">{source.addedDate}</td>
                    <td className="p-4">
                      {source.status === 'Active' ? (
                        <span className="px-3 py-1 text-xs font-semibold text-vesta-accent-success bg-vesta-accent-success/10 rounded-full">
                          {source.status}
                        </span>
                      ) : (
                         <span className="flex items-center px-3 py-1 text-xs font-semibold text-vesta-secondary bg-vesta-secondary/10 rounded-full">
                           <div className="w-3 h-3 border-2 border-vesta-secondary border-t-transparent rounded-full animate-spin mr-2"></div>
                           {source.status}
                         </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                          <button aria-label="Refresh Source" className="text-gray-400 hover:text-vesta-secondary transition">
                              <RefreshIcon className="w-5 h-5"/>
                          </button>
                          <button onClick={() => handleDeleteSource(source.id)} aria-label="Delete Source" className="text-gray-400 hover:text-vesta-accent-critical transition">
                              <TrashIcon className="w-5 h-5"/>
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarMainLayout>
  );
};

export default KnowledgeBaseScreen;