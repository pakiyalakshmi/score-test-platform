
import React from 'react';

interface QuestionContentProps {
  question: {
    id: number;
    title: string;
    description?: string;
    responseType: 'text' | 'table' | 'multiChoice' | 'differential';
    responseOptions?: string[];
    tableHeaders?: string[][];
  };
  questionIndex: number;
  currentAnswer: any;
  onInputChange: (questionId: number, value: any) => void;
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  questionIndex,
  currentAnswer,
  onInputChange
}) => {
  return (
    <div key={question.id}>
      <h3 className="text-lg font-medium mb-3">{questionIndex + 1}. {question.title}</h3>
      {question.description && (
        <p className="text-sm text-gray-600 mb-4">{question.description}</p>
      )}

      {question.responseType === 'text' && (
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 min-h-[120px]"
          placeholder="Type your response here..."
          value={currentAnswer || ''}
          onChange={(e) => onInputChange(question.id, e.target.value)}
        ></textarea>
      )}

      {question.responseType === 'differential' && (
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: 4 }).map((_, i) => {
            const answersArray = Array.isArray(currentAnswer) 
              ? currentAnswer 
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
                    onInputChange(question.id, updatedArray);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {question.responseType === 'table' && question.tableHeaders && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {question.tableHeaders[0].map((header, i) => (
                  <th key={i} className="border border-gray-300 bg-gray-100 p-2 text-sm text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, rowIndex) => {
                const tableData = currentAnswer || {};
                
                return (
                  <tr key={rowIndex}>
                    {question.tableHeaders && question.tableHeaders[0].map((_, colIndex) => (
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
                            onInputChange(question.id, newTableData);
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
  );
};

export default QuestionContent;
