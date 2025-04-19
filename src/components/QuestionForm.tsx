
import { useState, useEffect, useMemo } from 'react';
import ExamHeader from './question-form/ExamHeader';
import QuestionContent from './question-form/QuestionContent';
import QuestionControls from './question-form/QuestionControls';
import QuestionNavigation from './question-form/QuestionNavigation';

interface QuestionFormProps {
  examTitle: string;
  timeRemaining: string;
  caseNumber: number;
  caseName: string;
  patientInfo?: {
    name: string;
    pronouns: string;
    age: number;
    imageUrl?: string;
  };
  patientWords?: string;
  questions: Array<{
    id: number;
    title: string;
    description?: string;
    responseType: 'text' | 'table' | 'multiChoice' | 'differential';
    responseOptions?: string[];
    tableHeaders?: string[][];
  }>;
  onNext: () => void;
  onSubmit: () => void;
  onAnswerChange?: (questionId: number, value: any) => void;
  currentAnswers?: Record<string, any>;
  currentQuestionIndex?: number;
  onQuestionNavigation?: (index: number) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  examTitle,
  timeRemaining,
  caseNumber,
  caseName,
  questions,
  onNext,
  onSubmit,
  onAnswerChange,
  currentAnswers = {},
  currentQuestionIndex = 0,
  onQuestionNavigation,
  patientWords
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(currentQuestionIndex || 0);
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([0]);
  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>(currentAnswers);
  const [visibleChunks, setVisibleChunks] = useState<number[]>([0]);
  
  const paragraphChunks = useMemo(() => {
    if (!patientWords) return [];
    // Split the paragraph into chunks by sentence endings (., !, ?)
    return patientWords.split(/(?<=[.!?])\s+/).filter(chunk => chunk.trim().length > 0);
  }, [patientWords]);

  // Update active question index when prop changes
  useEffect(() => {
    setActiveQuestionIndex(currentQuestionIndex);
  }, [currentQuestionIndex]);

  // Update local answers when prop changes
  useEffect(() => {
    setLocalAnswers(prev => ({...prev, ...currentAnswers}));
  }, [currentAnswers]);

  // Update visible chunks based on answered questions
  useEffect(() => {
    if (paragraphChunks.length === 0) return;

    const newVisibleChunks = [0];
    questions.forEach((question, index) => {
      if (localAnswers[question.id] && index < paragraphChunks.length) {
        newVisibleChunks.push(index + 1);
      }
    });
    
    setVisibleChunks([...new Set(newVisibleChunks)]);
  }, [localAnswers, questions, paragraphChunks.length]);

  // Determine if the current question has been answered
  const isCurrentQuestionAnswered = () => {
    if (!questions[activeQuestionIndex]) return false;
    
    const questionId = questions[activeQuestionIndex].id;
    const answer = localAnswers[questionId];
    
    if (!answer) return false;
    
    if (typeof answer === 'string') {
      return answer.trim() !== '';
    } else if (Array.isArray(answer)) {
      return answer.some(item => item && item.trim() !== '');
    } else if (typeof answer === 'object') {
      return Object.keys(answer).length > 0 && Object.values(answer).some(
        row => typeof row === 'object' && Object.values(row).some(cell => cell && String(cell).trim() !== '')
      );
    }
    
    return false;
  };

  // Handle input changes
  const handleInputChange = (questionId: number, value: any) => {
    const newAnswers = {
      ...localAnswers,
      [questionId]: value
    };
    
    setLocalAnswers(newAnswers);
    
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      const nextIndex = activeQuestionIndex + 1;
      
      if (!visibleQuestions.includes(nextIndex)) {
        setVisibleQuestions(prev => [...prev, nextIndex]);
      }
      
      if (onQuestionNavigation) {
        onQuestionNavigation(nextIndex);
      } else {
        setActiveQuestionIndex(nextIndex);
      }
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      if (onQuestionNavigation) {
        onQuestionNavigation(activeQuestionIndex - 1);
      } else {
        setActiveQuestionIndex(activeQuestionIndex - 1);
      }
    }
  };

  // Debug logging
  console.log('QuestionForm state:', {
    activeQuestionIndex,
    visibleQuestions,
    visibleChunks,
    localAnswers,
    paragraphChunks
  });

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <ExamHeader 
        examTitle={examTitle} 
        timeRemaining={timeRemaining} 
        onSubmit={onSubmit} 
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <QuestionNavigation 
          questions={questions}
          activeQuestionIndex={activeQuestionIndex}
          currentAnswers={localAnswers}
          onQuestionClick={(index) => {
            if (visibleQuestions.includes(index)) {
              if (onQuestionNavigation) {
                onQuestionNavigation(index);
              } else {
                setActiveQuestionIndex(index);
              }
            }
          }}
          visibleQuestions={visibleQuestions}
        />

        {visibleQuestions.includes(activeQuestionIndex) && questions[activeQuestionIndex] && (
          <QuestionContent 
            question={questions[activeQuestionIndex]}
            questionIndex={activeQuestionIndex}
            currentAnswer={localAnswers[questions[activeQuestionIndex].id]}
            onInputChange={handleInputChange}
            paragraphChunks={paragraphChunks}
            visibleChunks={visibleChunks}
          />
        )}

        <QuestionControls 
          activeQuestionIndex={activeQuestionIndex}
          totalQuestions={questions.length}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
          onSubmit={onSubmit}
          isQuestionAnswered={isCurrentQuestionAnswered()}
        />
      </div>
    </div>
  );
};

export default QuestionForm;
