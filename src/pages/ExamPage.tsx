
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import QuestionForm from '../components/QuestionForm';
import PatientInfoCard from '../components/exam/PatientInfoCard';
import MedicalHistorySection from '../components/exam/MedicalHistorySection';
import { useExamData } from '../hooks/useExamData';
import { useTimer } from '../hooks/useTimer';
import { saveAnswers, getAllAnswers, checkAllQuestionsAnswered, submitExamAnswers, clearExamAnswers } from '../utils/examAnswers';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ExamPage = () => {
  const { page } = useParams<{ page: string }>();
  const pageNumber = parseInt(page || '1');
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const { displayTime, isExpired } = useTimer(60, 0);
  
  useEffect(() => {
    if (pageNumber === 1) {
      clearExamAnswers();
      console.log('Starting new exam, cleared previous answers');
    }
    
    const savedAnswers = getAllAnswers();
    setAnswers(savedAnswers);
  }, []);
  
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [pageNumber]);
  
  useEffect(() => {
    if (isExpired) {
      toast.error("Time's up! Your exam is being submitted.", {
        duration: 5000,
      });
      
      const timer = setTimeout(() => {
        handleSubmit();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isExpired]);
  
  const { loading, examTitle, caseInfo, displayQuestions } = useExamData(pageNumber);
  
  useEffect(() => {
    if (pageNumber > 1) {
      const savedAnswers = getAllAnswers();
      setAnswers(savedAnswers);
    }
  }, [pageNumber]);
  
  const patientImageUrl = "/lovable-uploads/885815da-14b8-4b48-a843-41e92d404453.png";
  
  const handleNext = () => {
    if (!checkAllQuestionsAnswered(displayQuestions, answers)) {
      return;
    }
    
    saveAnswers(answers);
    
    if (pageNumber === 1) {
      navigate('/exam/2', { replace: true });
      toast.success("Page 1 completed");
    } else {
      const allAnswers = getAllAnswers();
      submitExamAnswers(allAnswers);
      navigate('/student/results', { replace: true });
      toast.success("Exam submitted successfully");
    }
  };
  
  const handleSubmit = () => {
    if (!checkAllQuestionsAnswered(displayQuestions, answers)) {
      return;
    }
    
    saveAnswers(answers);
    
    submitExamAnswers(getAllAnswers());
    navigate('/student/results', { replace: true });
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
  
  const patientWords = caseInfo || "I don't have the energy I used to. I'm still going on my walk around the neighborhood every morning, but it's taking me longer than usual. Sometimes I get short of breath and have to slow down. Other times it feels like my heart is racing or pounding in my chest, even when I'm not walking around.";
  
  const additionalHistory = pageNumber === 2 ? 
    "You ask Mr. Power some additional questions about his symptoms. He denies any chest pain, chest pressure, orthopnea, paroxysmal nocturnal dyspnea, cough, sputum production, wheezing, hemoptysis, fever, chills, dizziness, lightheadedness, syncope, excessive daytime somnolence, tremor, skin or hair changes, heat or cold intolerance, or unintentional weight loss. He does endorse some mild bilateral lower extremity edema over the past few weeks." : undefined;
  
  const pastMedicalHistory = pageNumber === 2 ? 
    "Coronary Artery Disease w/o history of MI. Status post percutaneous coronary intervention with stent 3 years ago. Hypertension. Hypercholesterolemia." : undefined;
  
  const medications = pageNumber === 2 ? 
    "Metoprolol. Atorvastatin. Aspirin." : undefined;
  
  const socialHistory = pageNumber === 2 ? 
    "Mr. Power is a retired engineer. He is married and has one adult child. Mr. Power smoked 1 pack of cigarettes per day from about age 20 to 35 and does not currently smoke. He denies alcohol or drug use. He exercises by walking 2 miles every day. He tries to eat a diet low in sodium and high in fruits and vegetables." : undefined;
  
  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4 lg:p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clinicus-blue"></div>
          <p className="ml-4 text-gray-600">Loading exam questions...</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[600px] w-full rounded-lg border"
          >
            <ResizablePanel defaultSize={8} minSize={5} maxSize={12} className="bg-gray-100">
              <div className="p-2 h-full">
                <div className="flex flex-col space-y-2">
                  {displayQuestions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionNavigation(index)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-clinicus-blue text-white'
                          : answers[question.id]
                          ? 'bg-green-100 text-green-800'
                          : 'bg-white text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Q {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={32} minSize={20} className="bg-white">
              <ScrollArea className="h-full w-full p-4">
                <div className="mb-4">
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
                
                <MedicalHistorySection
                  additionalHistory={additionalHistory}
                  pastMedicalHistory={pastMedicalHistory}
                  medications={medications}
                  socialHistory={socialHistory}
                />
              </ScrollArea>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={60} minSize={40} className="bg-white p-4">
              <div className="h-full flex flex-col">
                <h2 className="text-xl font-semibold text-clinicus-blue mb-3">{examTitle}</h2>
                
                <div className="flex-1">
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
                
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={handleQuestionNavigation.bind(null, Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 flex items-center gap-2 text-gray-600 disabled:opacity-50"
                  >
                    <ArrowLeft size={16} />
                    <span>Previous</span>
                  </button>
                  
                  <button 
                    onClick={handleQuestionNavigation.bind(null, Math.min(displayQuestions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === displayQuestions.length - 1}
                    className="px-4 py-2 flex items-center gap-2 text-gray-600 disabled:opacity-50"
                  >
                    <span>Next</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
