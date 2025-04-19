
import React, { useEffect } from 'react';
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
  paragraphChunks?: string[];
  visibleChunks?: number[];
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  questionIndex,
  currentAnswer,
  onInputChange,
  paragraphChunks = [],
  visibleChunks = []
}) => {
  // Stabilize the current answer to prevent cursor jumping
  const stableAnswer = React.useMemo(() => {
    if (question.responseType === 'text') {
      return currentAnswer || '';
    } else if (question.responseType === 'differential') {
      return Array.isArray(currentAnswer) ? currentAnswer : Array(4).fill('');
    } else if (question.responseType === 'table') {
      return currentAnswer || {};
    }
    return currentAnswer;
  }, [currentAnswer, question.responseType]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(question.id, e.target.value);
  };

  const handleDifferentialChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const answersArray = Array.isArray(stableAnswer) ? [...stableAnswer] : Array(4).fill('');
    answersArray[index] = e.target.value;
    onInputChange(question.id, answersArray);
  };

  const handleTableChange = (e: React.ChangeEvent<HTMLInputElement>, colIndex: number, rowIndex: number) => {
    const newTableData = {...(stableAnswer || {})};
    if (!newTableData[rowIndex]) {
      newTableData[rowIndex] = {};
    }
    newTableData[rowIndex][colIndex] = e.target.value;
    onInputChange(question.id, newTableData);
  };

  // Log the current answer for debugging
  useEffect(() => {
    console.log(`Question ${question.id} answer:`, currentAnswer);
  }, [currentAnswer, question.id]);

  // Display paragraph chunks progressively
  const renderParagraphChunks = () => {
    return paragraphChunks.map((chunk, index) => {
      if (!visibleChunks.includes(index)) return null;
      
      return (
        <div key={index} className="mb-4 text-gray-600 text-sm">
          <p>{chunk}</p>
        </div>
      );
    });
  };

  return (
    <div key={question.id} className="space-y-4">
      {paragraphChunks.length > 0 && renderParagraphChunks()}
      
      <div>
        <h3 className="text-lg font-medium mb-3">{questionIndex + 1}. {question.title}</h3>
        {question.description && (
          <p className="text-sm text-gray-600 mb-4">{question.description}</p>
        )}

        {question.responseType === 'text' && (
          <Textarea
            key={`text-${question.id}`}
            className="w-full min-h-[120px]"
            placeholder="Type your response here..."
            value={stableAnswer}
            onChange={handleTextChange}
          />
        )}

        {question.responseType === 'differential' && (
          <div className="grid grid-cols-1 gap-2">
            {Array.from({ length: 4 }).map((_, i) => {
              const answersArray = Array.isArray(stableAnswer) 
                ? stableAnswer 
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
                  const tableData = stableAnswer || {};
                  
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
    </div>
  );
};

export default QuestionContent;
