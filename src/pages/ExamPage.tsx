
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import QuestionForm from '../components/QuestionForm';
import PatientInfoCard from '../components/exam/PatientInfoCard';
import MedicalHistorySection from '../components/exam/MedicalHistorySection';
import { useExamData } from '../hooks/useExamData';
import { useTimer } from '../hooks/useTimer';
import { saveAnswers, getAllAnswers, checkAllQuestionsAnswered, submitExamAnswers, clearExamAnswers } from '../utils/examAnswers';

const ExamPage = () => {
  const { page } = useParams<{ page: string }>();
  const pageNumber = parseInt(page || '1');
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Initialize the exam timer - 60 minutes by default
  const { displayTime, isExpired } = useTimer(60, 0);
  
  // Clear previous answers on initial page load
  useEffect(() => {
    // Only clear answers when first coming to the exam (page 1)
    if (pageNumber === 1) {
      clearExamAnswers();
      console.log('Starting new exam, cleared previous answers');
    }
    
    // Load any answers that may exist (will be empty for a new exam)
    const savedAnswers = getAllAnswers();
    setAnswers(savedAnswers);
  }, []);
  
  // Reset question index when page changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [pageNumber]);
  
  // Auto-submit if timer expires
  useEffect(() => {
    if (isExpired) {
      toast.error("Time's up! Your exam is being submitted.", {
        duration: 5000,
      });
      
      // Auto-submit after a short delay to allow the user to see the message
      const timer = setTimeout(() => {
        handleSubmit();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isExpired]);
  
  // Use our custom hook to fetch exam data
  const { loading, examTitle, caseInfo, displayQuestions } = useExamData(pageNumber);
  
  // Load previous answers from localStorage when page changes
  useEffect(() => {
    if (pageNumber > 1) {
      const savedAnswers = getAllAnswers();
      setAnswers(savedAnswers);
    }
  }, [pageNumber]);
  
  // Example patient image - in a real app this would come from your data
  const patientImageUrl = "public/lovable-uploads/885815da-14b8-4b48-a843-41e92d404453.png";
  
  const handleNext = () => {
    // Check if all questions have been answered
    if (!checkAllQuestionsAnswered(displayQuestions, answers)) {
      return;
    }
    
    // Save answers to localStorage
    saveAnswers(answers);
    
    if (pageNumber === 1) {
      navigate('/exam/2');
      toast.success("Page 1 completed");
    } else {
      // Process and submit all answers
      const allAnswers = getAllAnswers();
      submitExamAnswers(allAnswers);
      navigate('/student/results');
      toast.success("Exam submitted successfully");
    }
  };
  
  const handleSubmit = () => {
    // Check if all questions have been answered
    if (!checkAllQuestionsAnswered(displayQuestions, answers)) {
      return;
    }
    
    // Save answers and navigate
    saveAnswers(answers);
    
    // Submit all answers
    submitExamAnswers(getAllAnswers());
    navigate('/student/results');
    toast.success("Exam submitted successfully");
  };
  
  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };
  
  // Use case info from the database if available
  const patientWords = caseInfo || "I don't have the energy I used to. I'm still going on my walk around the neighborhood every morning, but it's taking me longer than usual. Sometimes I get short of breath and have to slow down. Other times it feels like my heart is racing or pounding in my chest, even when I'm not walking around.";
  
  // Additional clinical data for page 2
  const additionalHistory = pageNumber === 2 ? 
    "You ask Mr. Power some additional questions about his symptoms. He denies any chest pain, chest pressure, orthopnea, paroxysmal nocturnal dyspnea, cough, sputum production, wheezing, hemoptysis, fever, chills, dizziness, lightheadedness, syncope, excessive daytime somnolence, tremor, skin or hair changes, heat or cold intolerance, or unintentional weight loss. He does endorse some mild bilateral lower extremity edema over the past few weeks." : undefined;
  
  const pastMedicalHistory = pageNumber === 2 ? 
    "Coronary Artery Disease w/o history of MI. Status post percutaneous coronary intervention with stent 3 years ago. Hypertension. Hypercholesterolemia." : undefined;
  
  const medications = pageNumber === 2 ? 
    "Metoprolol. Atorvastatin. Aspirin." : undefined;
  
  const socialHistory = pageNumber === 2 ? 
    "Mr. Power is a retired engineer. He is married and has one adult child. Mr. Power smoked 1 pack of cigarettes per day from about age 20 to 35 and does not currently smoke. He denies alcohol or drug use. He exercises by walking 2 miles every day. He tries to eat a diet low in sodium and high in fruits and vegetables." : undefined;
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clinicus-blue"></div>
          <p className="ml-4 text-gray-600">Loading exam questions...</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {/* Patient Info Section - at the top */}
          <div className="w-full bg-white p-4 rounded-lg shadow-sm">
            <PatientInfoCard
              patientInfo={{
                name: pageNumber === 1 ? "Lauren King" : "Mark Power",
                pronouns: pageNumber === 1 ? "she/her" : "he/him",
                age: pageNumber === 1 ? 2 : 75,
                imageUrl: patientImageUrl
              }}
              caseNumber={pageNumber}
              patientWords={patientWords}
            />
          </div>
          
          {/* Medical History Section - right below the blue box */}
          <div className="w-full">
            <MedicalHistorySection
              additionalHistory={additionalHistory}
              pastMedicalHistory={pastMedicalHistory}
              medications={medications}
              socialHistory={socialHistory}
            />
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Main content column */}
            <div className="col-span-12">
              {/* Navigation and Question Content */}
              <div className="grid grid-cols-12 gap-6">
                {/* Navigation Column */}
                <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Questions</h3>
                  <div className="flex flex-col space-y-2">
                    {displayQuestions.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() => handleQuestionNavigation(index)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                          index === currentQuestionIndex
                            ? 'bg-clinicus-blue text-white'
                            : answers[question.id]
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        Question {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Question Content Column */}
                <div className="col-span-10">
                  <QuestionForm
                    examTitle={examTitle}
                    timeRemaining={displayTime}
                    caseNumber={pageNumber}
                    caseName={pageNumber === 1 ? "Lauren King" : "MP"}
                    questions={displayQuestions}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    onAnswerChange={handleAnswerChange}
                    currentAnswers={answers}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionNavigation={handleQuestionNavigation}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
