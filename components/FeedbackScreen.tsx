
import React from 'react';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface FeedbackScreenProps {
  isCorrect: boolean;
  explanation: string;
  onNext: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ isCorrect, explanation, onNext }) => {
  const bgColor = isCorrect ? 'bg-green-500/10' : 'bg-red-500/10';
  const textColor = isCorrect ? 'text-brand-success' : 'text-brand-error';
  const iconColor = isCorrect ? 'bg-brand-success' : 'bg-brand-error';
  const title = isCorrect ? 'Resposta Certa!' : 'Quase lá!';

  return (
    <div className={`w-full max-w-3xl text-center p-8 rounded-2xl shadow-lg flex flex-col items-center animate-fade-in ${bgColor}`}>
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${iconColor}`}>
        {isCorrect ? <CheckIcon className="w-16 h-16 text-white"/> : <XIcon className="w-16 h-16 text-white"/>}
      </div>
      
      <h2 className={`text-4xl font-bold mb-4 ${textColor}`}>{title}</h2>
      
      <p className="text-xl text-brand-text/90 my-4 leading-relaxed">
        {explanation}
      </p>

      <button
        onClick={onNext}
        className="mt-8 px-10 py-4 bg-brand-primary hover:bg-purple-700 text-white font-bold text-xl rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-bg"
      >
        Próxima Pergunta
      </button>
    </div>
  );
};

export default FeedbackScreen;
