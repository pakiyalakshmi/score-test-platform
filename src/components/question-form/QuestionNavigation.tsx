
import React from 'react';

interface QuestionNavigationProps {
  questions: Array<{
    id: number;
    title: string;
  }>;
  activeQuestionIndex: number;
  currentAnswers: Record<string, any>;
  onQuestionClick: (index: number) => void;
  visibleQuestions: number[];
  hasAnswer: (questionId: number) => boolean;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  activeQuestionIndex,
  currentAnswers,
  onQuestionClick,
  visibleQuestions,
  hasAnswer
}) => {
  console.log("QuestionNavigation state:", { 
    activeQuestionIndex, 
    visibleQuestions,
    currentAnswers
  });

  return (
    <div className="flex mb-4 space-x-2 overflow-x-auto py-2">
      {questions.map((question, index) => {
        // Only show buttons for questions that should be visible
        if (!visibleQuestions.includes(index)) {
          return null;
        }
        
        const isAnswered = hasAnswer(question.id);
        
        return (
          <button
            key={question.id}
            onClick={() => onQuestionClick(index)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              index === activeQuestionIndex
                ? 'bg-clinicus-blue text-white'
                : isAnswered
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Question {index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionNavigation;
