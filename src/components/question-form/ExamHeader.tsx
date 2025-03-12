
import React from 'react';
import { Clock, FileText, Download } from 'lucide-react';

interface ExamHeaderProps {
  examTitle: string;
  timeRemaining: string;
  onSubmit: () => void;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
  examTitle,
  timeRemaining,
  onSubmit
}) => {
  return (
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
          <Clock size={16} className={timeRemaining.startsWith("0:") ? "text-red-500 animate-pulse" : "text-red-500"} />
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
  );
};

export default ExamHeader;
