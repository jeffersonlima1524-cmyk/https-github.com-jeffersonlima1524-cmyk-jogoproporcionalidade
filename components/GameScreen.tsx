
import React, { useState } from 'react';
import { Question, ProportionType } from '../types';

interface GameScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: number) => void;
  conceptType: ProportionType;
}

const GameScreen: React.FC<GameScreenProps> = ({ question, questionNumber, totalQuestions, onSubmit, conceptType }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswer !== null) {
      onSubmit(selectedAnswer);
    }
  };

  return (
    <div className="bg-brand-surface p-8 rounded-2xl shadow-lg w-full max-w-3xl animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-brand-text/80">
          <p className="font-semibold text-brand-accent capitalize">{conceptType}</p>
          <p>Pergunta {questionNumber} de {totalQuestions}</p>
        </div>
        <div className="w-full bg-brand-bg rounded-full h-4">
          <div
            className="bg-brand-secondary h-4 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-2xl md:text-3xl font-semibold text-center my-8 leading-normal text-brand-text">
        {question.question}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedAnswer(option)}
              className={`p-6 text-2xl font-bold text-center rounded-lg border-4 transition-all duration-200 
                ${selectedAnswer === option
                  ? 'bg-brand-accent border-brand-accent text-brand-bg'
                  : 'bg-brand-primary border-transparent hover:border-brand-accent hover:bg-purple-700'
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={selectedAnswer === null}
            className="px-12 py-4 bg-brand-secondary disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-pink-600 text-white font-bold text-2xl rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-bg"
          >
            Responder
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameScreen;
