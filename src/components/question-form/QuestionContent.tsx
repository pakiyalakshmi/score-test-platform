
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(question.id, e.target.value);
  };

  const handleDifferentialChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // Initialize an array if it doesn't exist
    const answersArray = Array.isArray(currentAnswer) ? [...currentAnswer] : Array(4).fill('');
    answersArray[index] = e.target.value;
    onInputChange(question.id, answersArray);
  };

  const handleTableChange = (e: React.ChangeEvent<HTMLInputElement>, colIndex: number, rowIndex: number) => {
    // Initialize or update table data
    const newTableData = {...(currentAnswer || {})};
    if (!newTableData[rowIndex]) {
      newTableData[rowIndex] = {};
    }
    newTableData[rowIndex][colIndex] = e.target.value;
    onInputChange(question.id, newTableData);
  };

  return (
    <div key={question.id}>
      <h3 className="text-lg font-medium mb-3">{questionIndex + 1}. {question.title}</h3>
      {question.description && (
        <p className="text-sm text-gray-600 mb-4">{question.description}</p>
      )}

      {question.responseType === 'text' && (
        <Textarea
          className="w-full min-h-[120px]"
          placeholder="Type your response here..."
          value={currentAnswer || ''}
          onChange={handleTextChange}
        />
      )}

      {question.responseType === 'differential' && (
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: 4 }).map((_, i) => {
            const answersArray = Array.isArray(currentAnswer) 
              ? currentAnswer 
              : Array(4).fill('');
              
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{i+1}. </span>
                <Input
                  type="text"
                  className="w-full"
                  placeholder={`Item ${i+1}`}
                  value={answersArray[i] || ''}
                  onChange={(e) => handleDifferentialChange(e, i)}
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
                        <Input
                          type="text"
                          className="w-full border-none focus:outline-none bg-transparent"
                          value={tableData[rowIndex]?.[colIndex] || ''}
                          onChange={(e) => handleTableChange(e, colIndex, rowIndex)}
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
