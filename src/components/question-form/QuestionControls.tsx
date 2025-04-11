
import React from 'react';

interface QuestionControlsProps {
  activeQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const QuestionControls: React.FC<QuestionControlsProps> = ({
  activeQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit
}) => {
  return (
    <div className="flex justify-between mt-6">
      <button 
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          activeQuestionIndex > 0 
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        onClick={onPrevious}
        disabled={activeQuestionIndex === 0}
      >
        Previous
      </button>

      {activeQuestionIndex < totalQuestions - 1 ? (
        <button 
          className="px-4 py-2 bg-clinicus-blue text-white rounded-md text-sm font-medium hover:bg-blue-700"
          onClick={onNext}
        >
          Next Question
        </button>
      ) : (
        <button 
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-sm font-medium"
          onClick={onSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default QuestionControls;
