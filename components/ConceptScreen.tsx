
import React from 'react';

interface ConceptScreenProps {
  title: string;
  explanation: string;
  imageUrl: string;
  onNext: () => void;
}

const ConceptScreen: React.FC<ConceptScreenProps> = ({ title, explanation, imageUrl, onNext }) => {
  return (
    <div className="bg-brand-surface p-8 rounded-2xl shadow-lg w-full max-w-3xl flex flex-col items-center text-center animate-fade-in">
      <h2 className="text-4xl font-bold text-brand-accent mb-4">{title}</h2>
      <img src={imageUrl} alt={title} className="rounded-lg shadow-md my-4 w-full max-w-lg object-cover h-64" />
      <p className="text-lg text-brand-text/90 my-4 max-w-2xl leading-relaxed">
        {explanation}
      </p>
      <button
        onClick={onNext}
        className="mt-6 px-8 py-3 bg-brand-primary hover:bg-purple-700 text-white font-bold text-xl rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-bg"
      >
        Entendi, vamos praticar!
      </button>
    </div>
  );
};

export default ConceptScreen;
