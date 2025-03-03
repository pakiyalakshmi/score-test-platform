
import { useState, useEffect } from 'react';
import ExamHeader from './question-form/ExamHeader';
import QuestionNavigation from './question-form/QuestionNavigation';
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
  patientInfo,
  patientWords,
  questions,
  onNext,
  onSubmit,
  onAnswerChange,
  currentAnswers = {},
  currentQuestionIndex = 0,
  onQuestionNavigation
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(currentQuestionIndex || 0);
  
  // Update local state when prop changes
  useEffect(() => {
    setActiveQuestionIndex(currentQuestionIndex);
  }, [currentQuestionIndex]);

  const handleInputChange = (questionId: number, value: any) => {
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  const handleQuestionClick = (index: number) => {
    setActiveQuestionIndex(index);
    if (onQuestionNavigation) {
      onQuestionNavigation(index);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      handleQuestionClick(activeQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      handleQuestionClick(activeQuestionIndex - 1);
    }
  };

  // Only show the active question
  const activeQuestion = questions[activeQuestionIndex];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <ExamHeader 
        examTitle={examTitle} 
        timeRemaining={timeRemaining} 
        onSubmit={onSubmit} 
      />

      <QuestionNavigation 
        questions={questions}
        activeQuestionIndex={activeQuestionIndex}
        currentAnswers={currentAnswers}
        onQuestionClick={handleQuestionClick}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {activeQuestion && (
          <QuestionContent 
            question={activeQuestion}
            questionIndex={activeQuestionIndex}
            currentAnswer={currentAnswers[activeQuestion.id]}
            onInputChange={handleInputChange}
          />
        )}

        <QuestionControls 
          activeQuestionIndex={activeQuestionIndex}
          totalQuestions={questions.length}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
          onSubmit={onNext}
        />
      </div>
    </div>
  );
};

export default QuestionForm;
