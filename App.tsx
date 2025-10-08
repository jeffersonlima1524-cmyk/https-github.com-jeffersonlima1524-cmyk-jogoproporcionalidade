import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, ProportionType, Question } from './types';
import { CONCEPTS, TOTAL_QUESTIONS_PER_TYPE } from './constants';
import { generateQuestions } from './services/geminiService';
import ConceptScreen from './components/ConceptScreen';
import GameScreen from './components/GameScreen';
import FeedbackScreen from './components/FeedbackScreen';
import Spinner from './components/Spinner';
import CheckIcon from './components/icons/CheckIcon';
import AudioControl from './components/AudioControl';

const MusicNoteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-secondary" viewBox="0 0 20 20" fill="currentColor">
        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3z" />
    </svg>
);


export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMusicStarted, setIsMusicStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const loadQuestions = useCallback(async (conceptIndex: number) => {
    setIsLoading(true);
    const concept = CONCEPTS[conceptIndex];
    if (concept) {
      const fetchedQuestions = await generateQuestions(concept.type, TOTAL_QUESTIONS_PER_TYPE);
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setGameState(GameState.PLAYING);
    }
    setIsLoading(false);
  }, []);

  const handleStart = () => {
    setScore(0);
    setCurrentConceptIndex(0);
    setGameState(GameState.CONCEPT);

    if (!isMusicStarted && audioRef.current) {
        audioRef.current.play().catch(error => {
            console.error("A reprodução automática de áudio foi impedida pelo navegador.", error);
        });
        setIsMusicStarted(true);
    }
  };

  const handleConceptNext = () => {
    loadQuestions(currentConceptIndex);
  };
  
  const handleAnswerSubmit = (answer: number) => {
    const isAnswerCorrect = answer === questions[currentQuestionIndex].answer;
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }
    setGameState(GameState.FEEDBACK);
  };

  const handleFeedbackNext = () => {
    setIsCorrect(null);
    const isLastQuestionInConcept = currentQuestionIndex === questions.length - 1;

    if (isLastQuestionInConcept) {
      const isLastConcept = currentConceptIndex === CONCEPTS.length - 1;
      if (isLastConcept) {
        setGameState(GameState.FINISHED);
      } else {
        setCurrentConceptIndex(prev => prev + 1);
        setGameState(GameState.CONCEPT);
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setGameState(GameState.PLAYING);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
            <Spinner />
            <p className="mt-4 text-xl font-semibold text-brand-accent animate-pulse">Gerando as perguntas...</p>
        </div>
      );
    }

    switch (gameState) {
      case GameState.START:
        return (
          <div className="text-center flex flex-col items-center justify-center p-8 bg-brand-surface rounded-2xl shadow-2xl animate-fade-in">
            <MusicNoteIcon />
            <h1 className="text-5xl font-bold mt-4 mb-2 text-brand-text">Maestro de Ritmo</h1>
            <p className="text-xl mb-8 text-brand-text/80 max-w-md">Aprenda sobre proporcionalidade no ritmo da música!</p>
            <button
              onClick={handleStart}
              className="px-10 py-4 bg-brand-secondary hover:bg-pink-600 text-white font-bold text-2xl rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Começar a Jogar
            </button>
          </div>
        );
      case GameState.CONCEPT:
        const concept = CONCEPTS[currentConceptIndex];
        return (
          <ConceptScreen
            title={concept.title}
            explanation={concept.explanation}
            imageUrl={concept.imageUrl}
            onNext={handleConceptNext}
          />
        );
      case GameState.PLAYING:
        return (
          <GameScreen
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onSubmit={handleAnswerSubmit}
            conceptType={CONCEPTS[currentConceptIndex].type}
          />
        );
      case GameState.FEEDBACK:
        return (
          <FeedbackScreen
            isCorrect={isCorrect!}
            explanation={questions[currentQuestionIndex].explanation}
            onNext={handleFeedbackNext}
          />
        );
      case GameState.FINISHED:
        const totalQuestions = CONCEPTS.length * TOTAL_QUESTIONS_PER_TYPE;
        const percentage = Math.round((score / totalQuestions) * 100);
        return (
          <div className="text-center flex flex-col items-center justify-center p-12 bg-brand-surface rounded-2xl shadow-2xl animate-fade-in">
             <div className="w-32 h-32 bg-brand-success rounded-full flex items-center justify-center mb-6">
                 <CheckIcon className="w-20 h-20 text-white"/>
             </div>
            <h1 className="text-5xl font-bold mb-2 text-brand-success">Parabéns!</h1>
            <p className="text-2xl mb-4 text-brand-text/80">Você completou o desafio Maestro de Ritmo!</p>
            <p className="text-4xl font-bold text-brand-accent mb-8">
              Sua pontuação: {score} / {totalQuestions} ({percentage}%)
            </p>
            <button
              onClick={handleStart}
              className="px-10 py-4 bg-brand-secondary hover:bg-pink-600 text-white font-bold text-2xl rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Jogar Novamente
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
       <audio 
        ref={audioRef} 
        src="https://storage.googleapis.com/maker-suite-media/user/audios/2024/05/29/The_Four_Seasons_Vivaldi_Ouverture.mp3" 
        loop 
        preload="auto"
      />
      <AudioControl audioRef={audioRef} />
      <div className="w-full max-w-4xl min-h-[500px] flex items-center justify-center">
        {renderContent()}
      </div>
    </main>
  );
}