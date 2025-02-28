
import { useState } from 'react';
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
}) => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleInputChange = (questionId: number, value: string) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

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

      <div className="grid grid-cols-5 gap-6 flex-1">
        <div className="col-span-2 bg-clinicus-blue text-white rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-medium">Case {caseNumber}: {caseName}</h2>
            <div className="flex flex-col gap-1 mt-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 text-right">{i+1}.</span>
                  <div className={`w-2 h-2 rounded-full ${i < caseNumber ? 'bg-clinicus-gold' : 'bg-white/30'}`}></div>
                </div>
              ))}
            </div>
          </div>

          {patientInfo && (
            <div className="p-4">
              {patientInfo.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden max-w-[200px] mx-auto">
                  <img 
                    src={patientInfo.imageUrl} 
                    alt={patientInfo.name} 
                    className="w-full object-cover"
                  />
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Case {caseNumber}</h3>
                <p className="text-white/80">Name: {patientInfo.name}</p>
                <p className="text-white/80">Pronouns: {patientInfo.pronouns}</p>
                <p className="text-white/80">Age: {patientInfo.age}</p>
              </div>

              {patientWords && (
                <div>
                  <h3 className="font-medium mb-2 border-b border-white/10 pb-2">Patient's Words</h3>
                  <p className="text-sm text-white/90 italic">"{patientWords}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="col-span-3 rounded-lg border border-gray-200 bg-white p-6">
          {questions.map((question) => (
            <div key={question.id} className="mb-8">
              <h3 className="text-lg font-medium mb-3">{question.id}. {question.title}</h3>
              {question.description && (
                <p className="text-sm text-gray-600 mb-4">{question.description}</p>
              )}

              {question.responseType === 'text' && (
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[120px]"
                  placeholder="Type your response here..."
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                ></textarea>
              )}

              {question.responseType === 'differential' && (
                <div className="grid grid-cols-1 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{i+1}. </span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder={`Item ${i+1}`}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                      />
                    </div>
                  ))}
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
                      {Array.from({ length: 4 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          {question.tableHeaders && question.tableHeaders[0].map((_, colIndex) => (
                            <td key={colIndex} className="border border-gray-300 p-2">
                              <input
                                type="text"
                                className="w-full border-none focus:outline-none"
                                onChange={(e) => 
                                  handleInputChange(
                                    question.id, 
                                    { ...responses[question.id], [rowIndex]: e.target.value }
                                  )
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button 
              className="gold-button"
              onClick={onNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
