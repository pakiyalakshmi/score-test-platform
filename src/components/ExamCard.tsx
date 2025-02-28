
import { Calendar, Clock, Book } from "lucide-react";
import { Link } from "react-router-dom";

interface ExamCardProps {
  title: string;
  subtitle?: string;
  hours?: number;
  questions?: number;
  date?: string;
  percentage?: number;
  link: string;
  buttonText?: string;
}

const ExamCard = ({
  title,
  subtitle,
  hours,
  questions,
  date,
  percentage,
  link,
  buttonText = "Start"
}: ExamCardProps) => {
  return (
    <div className="glass-card p-5 flex flex-col h-full animate-fade-in">
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-500">{subtitle}</h3>
        <h2 className="text-xl font-semibold text-clinicus-blue">{title}</h2>
      </div>
      
      {percentage !== undefined ? (
        <div className="mt-3 mb-5">
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-gray-600">{percentage}% complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill animate-progress" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-auto">
          {hours !== undefined && (
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{hours} Hours</span>
            </div>
          )}
          
          {questions !== undefined && (
            <div className="flex items-center gap-2">
              <Book size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{questions} Q's</span>
            </div>
          )}
          
          {date && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{date}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 flex justify-center">
        <Link to={link} className="gold-button text-center min-w-[80px]">
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default ExamCard;
