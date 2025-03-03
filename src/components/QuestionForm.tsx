
import { useState, useEffect } from 'react';
import { Clock, FileText, Download } from 'lucide-react';

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

  // Only show the active question
  const activeQuestion = questions[activeQuestionIndex];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-4">
          <div className="bg-clinicus-blue rounded-full p-1 w-8 h-8 flex items-center justify-center">
            <div className="bg-white rounded-full w-2 h-2"></div>
          </div>
          <h1 className="text-xl font-semibold">{examTitle}</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-gray-600" />
            <span className="text-sm text-gray-600">Exam</span>
          </div>
          <div className="flex items-center gap-2">
            <Download size={18} className="text-gray-600" />
            <span className="text-sm text-gray-600">Resources</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
            <Clock size={16} className="text-red-500" />
            <span className="text-sm font-medium text-gray-800">{timeRemaining}</span>
          </div>
          <button 
            className="clinicus-button"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Question navigation */}
      <div className="flex mb-4 space-x-2 overflow-x-auto py-2">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => handleQuestionClick(index)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              index === activeQuestionIndex
                ? 'bg-clinicus-blue text-white'
                : currentAnswers[question.id]
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Question {index + 1}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {activeQuestion && (
          <div key={activeQuestion.id}>
            <h3 className="text-lg font-medium mb-3">{activeQuestionIndex + 1}. {activeQuestion.title}</h3>
            {activeQuestion.description && (
              <p className="text-sm text-gray-600 mb-4">{activeQuestion.description}</p>
            )}

            {activeQuestion.responseType === 'text' && (
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 min-h-[120px]"
                placeholder="Type your response here..."
                value={currentAnswers[activeQuestion.id] || ''}
                onChange={(e) => handleInputChange(activeQuestion.id, e.target.value)}
              ></textarea>
            )}

            {activeQuestion.responseType === 'differential' && (
              <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: 4 }).map((_, i) => {
                  const answersArray = Array.isArray(currentAnswers[activeQuestion.id]) 
                    ? currentAnswers[activeQuestion.id] 
                    : ['', '', '', ''];
                    
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{i+1}. </span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder={`Item ${i+1}`}
                        value={answersArray[i] || ''}
                        onChange={(e) => {
                          const updatedArray = [...(answersArray || ['', '', '', ''])];
                          updatedArray[i] = e.target.value;
                          handleInputChange(activeQuestion.id, updatedArray);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {activeQuestion.responseType === 'table' && activeQuestion.tableHeaders && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      {activeQuestion.tableHeaders[0].map((header, i) => (
                        <th key={i} className="border border-gray-300 bg-gray-100 p-2 text-sm text-left">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }).map((_, rowIndex) => {
                      const tableData = currentAnswers[activeQuestion.id] || {};
                      
                      return (
                        <tr key={rowIndex}>
                          {activeQuestion.tableHeaders && activeQuestion.tableHeaders[0].map((_, colIndex) => (
                            <td key={colIndex} className="border border-gray-300 p-2">
                              <input
                                type="text"
                                className="w-full border-none focus:outline-none"
                                value={tableData[rowIndex]?.[colIndex] || ''}
                                onChange={(e) => {
                                  const newTableData = {...tableData};
                                  if (!newTableData[rowIndex]) {
                                    newTableData[rowIndex] = {};
                                  }
                                  newTableData[rowIndex][colIndex] = e.target.value;
                                  handleInputChange(activeQuestion.id, newTableData);
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeQuestionIndex > 0 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            onClick={() => {
              if (activeQuestionIndex > 0) {
                handleQuestionClick(activeQuestionIndex - 1);
              }
            }}
            disabled={activeQuestionIndex === 0}
          >
            Previous
          </button>

          {activeQuestionIndex < questions.length - 1 ? (
            <button 
              className="px-4 py-2 bg-clinicus-blue text-white rounded-md text-sm font-medium"
              onClick={() => {
                handleQuestionClick(activeQuestionIndex + 1);
              }}
            >
              Next Question
            </button>
          ) : (
            <button 
              className="gold-button"
              onClick={onNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
