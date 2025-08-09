import React, { useState } from 'react';
import { NavigateTo, Screen, User, KnowledgeSource } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';
import { PlusIcon, TrashIcon, LibraryIcon, ChevronDownIcon } from '../components/Icons';

interface KnowledgeBaseScreenProps {
  navigateTo: NavigateTo;
  currentUser: User;
  onLogout: () => void;
  sources: KnowledgeSource[];
  onAddSource: (title: string, content: string) => void;
  onDeleteSource: (id: string) => void;
}

const KnowledgeSourceCard = ({ source, onDelete }: { source: KnowledgeSource, onDelete: (id: string) => void}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="bg-light-card dark:bg-dark-card rounded-lg card-shadow border border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h4 className="font-bold text-primary-text-light dark:text-primary-text-dark">{source.title}</h4>
                <div className="flex items-center">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(source.id); }} 
                        className="p-1 text-secondary-text-light dark:text-secondary-text-dark hover:text-accent-critical dark:hover:text-accent-critical mr-2"
                        aria-label="Delete source"
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                    <ChevronDownIcon className={`w-6 h-6 text-secondary-text-light dark:text-secondary-text-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="p-4 pt-0">
                    <div className="bg-light-main dark:bg-dark-main p-4 rounded-md max-h-60 overflow-y-auto">
                        <pre className="text-sm text-secondary-text-light dark:text-secondary-text-dark whitespace-pre-wrap font-sans">{source.content}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

const KnowledgeBaseScreen: React.FC<KnowledgeBaseScreenProps> = ({ navigateTo, currentUser, onLogout, sources, onAddSource, onDeleteSource }) => {
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddSource = () => {
        if (!newTitle.trim() || !newContent.trim()) {
            alert("Please provide both a title and content for the knowledge source.");
            return;
        }
        setIsAdding(true);
        onAddSource(newTitle, newContent);
        // Reset form after a short delay to allow state to update
        setTimeout(() => {
          setNewTitle('');
          setNewContent('');
          setIsAdding(false);
        }, 300);
    };
    
  return (
    <SidebarMainLayout navigateTo={navigateTo} activeScreen={Screen.KnowledgeBase} currentUser={currentUser} onLogout={onLogout}>
      <Header title="Knowledge Base" />
      <div className="p-8 space-y-8">
        
        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg card-shadow border border-border-light dark:border-border-dark">
            <h3 className="text-lg font-bold text-primary-text-light dark:text-primary-text-dark mb-4">Add New Knowledge Source</h3>
            <div className="space-y-4">
                <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., BSP Circular No. 1048"
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-light-main dark:bg-dark-main text-primary-text-light dark:text-primary-text-dark"
                    disabled={isAdding}
                />
                 <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Paste the full text of the regulation or policy here..."
                    className="w-full h-40 px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-light-main dark:bg-dark-main text-primary-text-light dark:text-primary-text-dark resize-y"
                    disabled={isAdding}
                />
                <div className="flex justify-end">
                    <button 
                        onClick={handleAddSource}
                        disabled={isAdding || !newTitle.trim() || !newContent.trim()}
                        className="flex-shrink-0 flex items-center justify-center px-6 py-2 btn-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Source
                    </button>
                </div>
            </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary-text-light dark:text-primary-text-dark">Managed Sources</h2>
          {sources.length > 0 ? (
              sources.map(source => (
                  <KnowledgeSourceCard key={source.id} source={source} onDelete={onDeleteSource} />
              ))
          ) : (
             <div className="text-center bg-light-card dark:bg-dark-card p-12 rounded-xl card-shadow border border-border-light dark:border-border-dark">
                <LibraryIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-semibold text-primary-text-light dark:text-primary-text-dark mt-4">Your Knowledge Base is Empty</h3>
                <p className="mt-1 text-secondary-text-light dark:text-secondary-text-dark">Add regulations or internal policies to customize Vesta's analysis.</p>
            </div>
          )}
        </div>
      </div>
    </SidebarMainLayout>
  );
};

export default KnowledgeBaseScreen;