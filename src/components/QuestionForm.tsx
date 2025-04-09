
import { useState, useEffect } from 'react';
import ExamHeader from './question-form/ExamHeader';
import QuestionContent from './question-form/QuestionContent';
import QuestionControls from './question-form/QuestionControls';

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
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([0]); // Start with only first question visible
  
  // Update local state when prop changes
  useEffect(() => {
    setActiveQuestionIndex(currentQuestionIndex);
  }, [currentQuestionIndex]);

  // Check for completed questions on mount and when answers change
  useEffect(() => {
    const newCompletedQuestions: number[] = [];
    
    // Check each question's answer
    questions.forEach((question, index) => {
      const answer = currentAnswers[question.id];
      
      if (answer) {
        // For text responses
        if (question.responseType === 'text' && typeof answer === 'string' && answer.trim() !== '') {
          newCompletedQuestions.push(index);
        }
        // For differential (array) responses
        else if (question.responseType === 'differential' && Array.isArray(answer) && 
                answer.some(item => item && item.trim() !== '')) {
          newCompletedQuestions.push(index);
        }
        // For table responses
        else if (question.responseType === 'table' && typeof answer === 'object' && 
                Object.keys(answer).length > 0) {
          newCompletedQuestions.push(index);
        }
      }
    });
    
    setCompletedQuestions(newCompletedQuestions);
    
    // Update visible questions based on completed ones
    const maxVisible = Math.max(...completedQuestions, 0) + 1;
    const newVisibleQuestions = Array.from({ length: maxVisible + 1 }, (_, i) => i).filter(i => i < questions.length);
    setVisibleQuestions(newVisibleQuestions);
  }, [currentAnswers, questions]);

  const handleInputChange = (questionId: number, value: any) => {
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      if (onQuestionNavigation) {
        onQuestionNavigation(activeQuestionIndex + 1);
      } else {
        setActiveQuestionIndex(activeQuestionIndex + 1);
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

  // Only show the active question if it's supposed to be visible
  const activeQuestion = questions[activeQuestionIndex];
  const isQuestionVisible = visibleQuestions.includes(activeQuestionIndex);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <ExamHeader 
        examTitle={examTitle} 
        timeRemaining={timeRemaining} 
        onSubmit={onSubmit} 
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {activeQuestion && isQuestionVisible ? (
          <QuestionContent 
            question={activeQuestion}
            questionIndex={activeQuestionIndex}
            currentAnswer={currentAnswers[activeQuestion.id]}
            onInputChange={handleInputChange}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            Please complete the previous question to proceed.
          </div>
        )}

        <QuestionControls 
          activeQuestionIndex={activeQuestionIndex}
          totalQuestions={questions.length}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
          onSubmit={onNext}
          isNextDisabled={activeQuestionIndex < questions.length - 1 && !completedQuestions.includes(activeQuestionIndex)}
        />
      </div>
    </div>
  );
};

export default QuestionForm;
