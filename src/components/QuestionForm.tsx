
import { useState, useEffect } from 'react';
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
  onQuestionNavigation
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(currentQuestionIndex || 0);
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([0]); // Initially only show first question
  
  // Update local state when prop changes
  useEffect(() => {
    setActiveQuestionIndex(currentQuestionIndex);
  }, [currentQuestionIndex]);

  // Update visible questions when answers change
  useEffect(() => {
    const newVisibleQuestions = [0]; // Always show the first question
    
    // For each answered question, make the next one visible
    questions.forEach((question, index) => {
      if (index > 0 && currentAnswers[questions[index - 1].id]) {
        newVisibleQuestions.push(index);
      }
    });
    
    setVisibleQuestions(newVisibleQuestions);
  }, [currentAnswers, questions]);

  // Check if the current question has been answered
  const isCurrentQuestionAnswered = () => {
    if (!questions[activeQuestionIndex]) return false;
    
    const questionId = questions[activeQuestionIndex].id;
    const answer = currentAnswers[questionId];
    
    if (!answer) return false;
    
    if (typeof answer === 'string') {
      return answer.trim() !== '';
    } else if (Array.isArray(answer)) {
      return answer.some(item => item && item.trim() !== '');
    } else if (typeof answer === 'object') {
      // For table answers
      return Object.keys(answer).length > 0 && Object.values(answer).some(
        row => typeof row === 'object' && Object.values(row).some(cell => cell && String(cell).trim() !== '')
      );
    }
    
    return false;
  };

  const handleInputChange = (questionId: number, value: any) => {
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      const nextIndex = activeQuestionIndex + 1;
      
      // Check if the next question is already visible
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

  const handlePreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      if (onQuestionNavigation) {
        onQuestionNavigation(activeQuestionIndex - 1);
      } else {
        setActiveQuestionIndex(activeQuestionIndex - 1);
      }
    }
  };

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
          currentAnswers={currentAnswers}
          onQuestionClick={(index) => {
            // Only allow navigation to visible questions
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

        {/* Only show questions that are in the visibleQuestions array */}
        {visibleQuestions.includes(activeQuestionIndex) && questions[activeQuestionIndex] && (
          <QuestionContent 
            question={questions[activeQuestionIndex]}
            questionIndex={activeQuestionIndex}
            currentAnswer={currentAnswers[questions[activeQuestionIndex].id]}
            onInputChange={handleInputChange}
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
