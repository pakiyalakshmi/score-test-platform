
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionForm from '../components/QuestionForm';
import { toast } from 'sonner';

const ExamPage = () => {
  const { page } = useParams<{ page: string }>();
  const pageNumber = parseInt(page || '1');
  const navigate = useNavigate();
  
  // Example patient image - in a real app this would come from your data
  const patientImageUrl = "public/lovable-uploads/885815da-14b8-4b48-a843-41e92d404453.png";
  
  const handleNext = () => {
    if (pageNumber === 1) {
      navigate('/exam/2');
      toast.success("Page 1 completed");
    } else {
      navigate('/student/results');
      toast.success("Exam submitted successfully");
    }
  };
  
  const handleSubmit = () => {
    navigate('/student/results');
    toast.success("Exam submitted successfully");
  };
  
  // Page 1 questions
  const page1Questions = [
    {
      id: 1,
      title: "What is the chief complaint?",
      description: "Limit your response to 50 characters.",
      responseType: 'text',
    },
    {
      id: 2,
      title: "List four diagnoses on your differential. Include at least 2 must-not-miss diagnoses.",
      responseType: 'differential',
    },
    {
      id: 3,
      title: "Ask five review of system questions to refine your Ddx, and list one underlying diagnosis each may suggest if present.",
      responseType: 'table',
      tableHeaders: [['Question', 'Underlying Diagnosis']],
    }
  ];
  
  // Page 2 questions
  const page2Questions = [
    {
      id: 4,
      title: "List three pertinent positive/negative findings, the diagnosis it relates to, and whether it makes it more/less likely from the provided history.",
      responseType: 'table',
      tableHeaders: [['Pertinent Positive/ Negative', 'Diagnosis it relates to', 'Is the Diagnosis More or Less Likely']],
    },
    {
      id: 5,
      title: "Besides the vital signs, list four physical exam findings, the diagnosis it relates to, and whether it makes it more/less likely.",
      responseType: 'table',
      tableHeaders: [['Physical Exam Finding', 'Diagnosis it relates to', 'Is the Diagnosis More or Less Likely']],
    }
  ];
  
  const patientWords = "I don't have the energy I used to. I'm still going on my walk around the neighborhood every morning, but it's taking me longer than usual. Sometimes I get short of breath and have to slow down. Other times it feels like my heart is racing or pounding in my chest, even when I'm not walking around.";
  
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
      <QuestionForm
        examTitle="Circulation Block CBL Final"
        timeRemaining="59:59"
        caseNumber={1}
        caseName="MP"
        patientInfo={{
          name: "Mark Power",
          pronouns: "he/him",
          age: 75,
          imageUrl: patientImageUrl
        }}
        patientWords={patientWords}
        questions={pageNumber === 1 ? page1Questions : page2Questions}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
      
      {pageNumber === 2 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="font-medium mb-3">Additional History</h3>
            <p className="text-sm text-gray-700">{additionalHistory}</p>
          </div>
          <div className="glass-card p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-3">Past Medical History</h3>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  <li>Coronary Artery Disease w/o history of MI</li>
                  <li>Status post percutaneous coronary intervention with stent 3 years ago</li>
                  <li>Hypertension</li>
                  <li>Hypercholesterolemia</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Medications</h3>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  <li>Metoprolol</li>
                  <li>Atorvastatin</li>
                  <li>Aspirin</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="glass-card p-5 md:col-span-2">
            <h3 className="font-medium mb-3">Social History</h3>
            <p className="text-sm text-gray-700">{socialHistory}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
