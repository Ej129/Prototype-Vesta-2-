
import React, { useState, useCallback } from 'react';
import { NavigateTo, Screen, User } from '../types';
import { SidebarMainLayout } from '../components/Layout';
import { Header } from '../components/Header';

interface UploadScreenProps {
  navigateTo: NavigateTo;
  onStartAnalysis: (content: string) => void;
  currentUser: User;
  onLogout: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ navigateTo, onStartAnalysis, currentUser, onLogout }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        const fileContent = readEvent.target?.result as string;
        setText(fileContent);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setFileName(file.name);
          const reader = new FileReader();
          reader.onload = (readEvent) => {
              const fileContent = readEvent.target?.result as string;
              setText(fileContent);
          };
          reader.readAsText(file);
      }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAnalyze = () => {
    if (text.trim()) {
      onStartAnalysis(text);
    }
  };

  return (
    <SidebarMainLayout navigateTo={navigateTo} activeScreen={Screen.Dashboard} currentUser={currentUser} onLogout={onLogout}>
      <Header title="Create New Analysis" />
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-vesta-primary dark:text-gray-100">Create a New Analysis</h1>
          <p className="text-vesta-text-light dark:text-gray-400 mt-2 mb-8">
            Upload your project plan (PDF, DOCX, TXT) or paste the text below.
          </p>
          
          <label htmlFor="file-upload" onDrop={handleFileDrop} onDragOver={handleDragOver} id="planUploader" className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition block">
            <input id="file-upload" type="file" className="hidden" onChange={handleFileSelect} />
            <p className="text-vesta-text-light dark:text-gray-400 font-semibold">{fileName || 'Drag & Drop Your File Here or Click to Browse'}</p>
          </label>
          
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
            <span className="px-4 text-vesta-text-light dark:text-gray-400 font-semibold">OR</span>
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
          </div>

          <textarea
            id="planPaster"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your business plan text here..."
            className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-vesta-secondary bg-white dark:bg-gray-700 dark:text-gray-100"
          ></textarea>

          <button
            onClick={handleAnalyze}
            disabled={!text.trim()}
            className="w-full md:w-auto mt-8 bg-vesta-primary text-white font-bold py-3 px-12 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:bg-opacity-50 disabled:cursor-not-allowed"
          >
            Analyze Plan
          </button>
        </div>
      </div>
    </SidebarMainLayout>
  );
};

export default UploadScreen;