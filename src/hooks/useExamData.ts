
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface ExamQuestion {
  id: number;
  title: string;
  description?: string;
  responseType: 'text' | 'table' | 'multiChoice' | 'differential';
  responseOptions?: string[];
  tableHeaders?: string[][];
}

// Define a more specific type for the case chunks to avoid deep type inference issues
interface CaseChunk {
  chunk_id: number;
  content: string;
}

// Fallback questions for page 1
const page1Questions = [
  {
    id: 1,
    title: "What is the chief complaint?",
    description: "Limit your response to 50 characters.",
    responseType: 'text' as const,
  },
  {
    id: 2,
    title: "List four diagnoses on your differential. Include at least 2 must-not-miss diagnoses.",
    responseType: 'differential' as const,
  },
  {
    id: 3,
    title: "Ask five review of system questions to refine your Ddx, and list one underlying diagnosis each may suggest if present.",
    responseType: 'table' as const,
    tableHeaders: [['Question', 'Underlying Diagnosis']],
  }
];

// Fallback questions for page 2
const page2Questions = [
  {
    id: 4,
    title: "List three pertinent positive/negative findings, the diagnosis it relates to, and whether it makes it more/less likely from the provided history.",
    responseType: 'table' as const,
    tableHeaders: [['Pertinent Positive/ Negative', 'Diagnosis it relates to', 'Is the Diagnosis More or Less Likely']],
  },
  {
    id: 5,
    title: "Besides the vital signs, list four physical exam findings, the diagnosis it relates to, and whether it makes it more/less likely.",
    responseType: 'table' as const,
    tableHeaders: [['Physical Exam Finding', 'Diagnosis it relates to', 'Is the Diagnosis More or Less Likely']],
  }
];

export const useExamData = (pageNumber: number) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [caseInfo, setCaseInfo] = useState<string>('');
  const [examTitle, setExamTitle] = useState<string>('Medical Exam');
  const [currentPage, setCurrentPage] = useState<number>(pageNumber);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [availablePages, setAvailablePages] = useState<number[]>([1]);

  // Transform database questions into the format expected by QuestionForm
  const formatQuestionsForDisplay = (questions: any[]): ExamQuestion[] => {
    return questions.map(q => ({
      id: q.question_id,
      title: q.question_text,
      description: q.clin_reasoning || undefined,
      responseType: q.answer_format?.type || 'text',
      tableHeaders: q.answer_format?.tableHeaders || undefined,
    }));
  };

  // Reset state when page changes
  useEffect(() => {
    if (currentPage !== pageNumber) {
      setLoading(true);
      setQuestions([]);
      setCaseInfo('');
      setCurrentPage(pageNumber);
    }
  }, [pageNumber, currentPage]);

  // Track available pages - which chunks the user is allowed to access
  useEffect(() => {
    // Get stored available pages from localStorage
    const storedAvailablePages = localStorage.getItem('availableExamPages');
    if (storedAvailablePages) {
      const parsedPages = JSON.parse(storedAvailablePages);
      setAvailablePages(parsedPages);
    }
  }, []);

  // Update available pages when user progresses
  const unlockNextPage = () => {
    if (currentPage < totalPages && !availablePages.includes(currentPage + 1)) {
      const updatedPages = [...availablePages, currentPage + 1];
      setAvailablePages(updatedPages);
      localStorage.setItem('availableExamPages', JSON.stringify(updatedPages));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the test information first
        const { data: testData, error: testError } = await supabase
          .from('tests')
          .select('*')
          .eq('test_id', 1) // Using test_id 1 for the CF case
          .single();
          
        if (testError) {
          throw testError;
        }
        
        if (testData) {
          setExamTitle(testData.test_name);
          
          // Use explicit type assertion for case_info to avoid deep type inference
          const caseInfo = testData.case_info as unknown as CaseChunk[];
          
          if (Array.isArray(caseInfo)) {
            // Find the case information for the current chunk/page
            const chunkData = caseInfo.find(chunk => chunk.chunk_id === pageNumber);
            if (chunkData && 'content' in chunkData) {
              setCaseInfo(String(chunkData.content));
            }
            
            // Determine total pages/chunks
            setTotalPages(caseInfo.length);
          } else {
            console.error('Expected case_info to be an array, got:', typeof testData.case_info);
          }
        }
        
        // Fetch questions for the current page
        const { data: questionData, error: questionError } = await supabase
          .from('exam_questions')
          .select('*')
          .eq('chunk_id', pageNumber)
          .order('question_id');
          
        if (questionError) {
          throw questionError;
        }
        
        if (questionData && questionData.length > 0) {
          console.log(`Fetched exam questions for page ${pageNumber}:`, questionData);
          setQuestions(questionData);
        } else {
          console.log(`No questions found for page ${pageNumber}, using fallbacks`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load exam data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [pageNumber]);

  // Use database questions if available, otherwise use fallbacks
  const displayQuestions = questions.length > 0 
    ? formatQuestionsForDisplay(questions) 
    : (pageNumber === 1 ? page1Questions : page2Questions);

  return {
    loading,
    examTitle,
    caseInfo,
    displayQuestions,
    totalPages,
    currentPage: pageNumber,
    availablePages,
    unlockNextPage
  };
};
