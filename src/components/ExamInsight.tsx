
import { Globe } from 'lucide-react';

interface ExamInsightProps {
  insight: string;
}

const ExamInsight: React.FC<ExamInsightProps> = ({ insight }) => {
  return (
    <div className="flex items-start gap-3 py-3 animate-fade-in">
      <div className="mt-1">
        <Globe size={18} className="text-clinicus-blue" />
      </div>
      <p className="text-sm text-gray-700">{insight}</p>
    </div>
  );
};

export default ExamInsight;
