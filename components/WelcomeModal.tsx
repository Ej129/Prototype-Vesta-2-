import React from 'react';
import { VestaLogo } from './Icons';

interface WelcomeModalProps {
  onStartTour: () => void;
  onSkipTour: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartTour, onSkipTour }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-lg w-full text-center transform transition-all animate-fade-in-up">
        <VestaLogo className="w-20 h-20 mx-auto text-vesta-primary" />
        <h2 id="modal-title" className="text-3xl font-bold text-vesta-primary dark:text-white mt-4">Welcome to Vesta!</h2>
        <p className="text-vesta-text-light dark:text-gray-300 mt-4 mb-8 text-lg">
          We're excited to help you build more resilient project plans. To see how Vesta works, we can start a quick tour using a sample analysis report. Would you like to begin?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onStartTour}
            className="bg-vesta-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-200"
          >
            Yes, Start Tour
          </button>
          <button
            onClick={onSkipTour}
            className="bg-gray-200 dark:bg-gray-700 text-vesta-text-light dark:text-gray-300 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            No, I'll Explore on my Own
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
