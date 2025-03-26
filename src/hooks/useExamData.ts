
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';

interface ExamQuestion {
  id: number;
  title: string;
  description?: string;
  responseType: 'text' | 'table' | 'multiChoice' | 'differential';
  responseOptions?: string[];
  tableHeaders?: string[][];
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

  // Transform database questions into the format expected by QuestionForm
  const formatQuestionsForDisplay = (questions: any[]): ExamQuestion[] => {
    return questions.map(q => ({
      id: q.question_id || q.id,
      title: q.question_text || q.title,
      description: q.clin_reasoning || q.description || undefined,
      responseType: (q.answer_format && q.answer_format.type) || q.responseType || 'text',
      tableHeaders: (q.answer_format && q.answer_format.tableHeaders) || q.tableHeaders || undefined,
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
          console.error('Error fetching test data:', testError);
          throw testError;
        }
        
        if (testData) {
          setExamTitle(testData.test_name);
          
          // Fix: Type check the case_info before using find method
          if (Array.isArray(testData.case_info)) {
            // Find the case information for the current chunk/page
            const chunkData = testData.case_info.find((chunk: any) => chunk.chunk_id === pageNumber);
            if (chunkData && typeof chunkData === 'object' && 'content' in chunkData) {
              setCaseInfo(String(chunkData.content)); // Convert to string to fix type error
            }
          } else {
            console.error('Expected case_info to be an array, got:', typeof testData.case_info);
          }
        }
        
        // Fetch questions from Supabase
        // Modified to query without the chunk_id column that doesn't exist
        const { data: questionData, error: questionError } = await supabase
          .from('exam_questions')
          .select('*')
          .order('test_id');
          
        if (questionError) {
          console.error('Error fetching exam questions:', questionError);
          throw questionError;
        }
        
        if (questionData && questionData.length > 0) {
          console.log(`Fetched exam questions:`, questionData);
          
          // Filter questions based on pageNumber if needed
          // For now, we'll just use all questions since there's no chunk_id
          setQuestions(questionData);
        } else {
          console.log(`No questions found, using fallbacks`);
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
    displayQuestions
  };
};
