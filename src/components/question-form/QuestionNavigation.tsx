
import React from 'react';

interface QuestionNavigationProps {
  questions: Array<{
    id: number;
    title: string;
  }>;
  activeQuestionIndex: number;
  currentAnswers: Record<string, any>;
  onQuestionClick: (index: number) => void;
  visibleQuestions: number[]; // Add visible questions prop
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  activeQuestionIndex,
  currentAnswers,
  onQuestionClick,
  visibleQuestions
}) => {
  // Helper function to check if a question has an answer
  const hasAnswer = (questionId: number) => {
    const answer = currentAnswers[questionId];
    
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
