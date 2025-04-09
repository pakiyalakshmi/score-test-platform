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

// Define proper types for the case info data structure
interface ChunkContent {
  content: string;
  questions?: {
    question_id: number;
    question_text: string;
    clin_reasoning?: string;
    answer_format?: {
      type: 'text' | 'table' | 'multiChoice' | 'differential';
      tableHeaders?: string[][];
    };
  }[];
}

// Fallback questions for different pages - with unique IDs per page
const getFallbackQuestions = (pageNumber: number) => {
  // Base questions for page 1
  if (pageNumber === 1) {
    return [
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
  }
  
  // Base questions for page 2
  if (pageNumber === 2) {
    return [
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
  }
  
  // Page 3 questions
  if (pageNumber === 3) {
    return [
      {
        id: 6,
        title: "What is the most likely diagnosis for Mr. Power?",
        responseType: 'text' as const,
      },
      {
        id: 7,
        title: "List three lab/imaging tests you would order to confirm the diagnosis.",
        responseType: 'table' as const,
        tableHeaders: [['Test', 'Rationale']],
      }
    ];
  }
  
  // Additional fallback questions for higher pages (with unique IDs)
  if (pageNumber === 4) {
    return [
      {
        id: 8, // Unique ID for page 4
        title: "List two treatment options for Mr. Power's condition.",
        responseType: 'table' as const,
        tableHeaders: [['Treatment Option', 'Rationale']],
      },
      {
        id: 9, // Unique ID for page 4
        title: "What is the most concerning complication of the patient's condition?",
        responseType: 'text' as const,
      }
    ];
  }
  
  if (pageNumber === 5) {
    return [
      {
        id: 10, // Unique ID for page 5
        title: "What is the long-term prognosis for this patient?",
        responseType: 'text' as const,
      },
      {
        id: 11, // Unique ID for page 5
        title: "List three follow-up instructions for this patient.",
        responseType: 'table' as const,
        tableHeaders: [['Follow-up Instruction', 'Timeframe']],
      }
    ];
  }
  
  if (pageNumber === 6) {
    return [
      {
        id: 12, // Unique ID for page 6
        title: "Write a brief summary of the patient case.",
        responseType: 'text' as const,
      },
      {
        id: 13, // Unique ID for page 6
        title: "What are the key learning points from this case?",
        responseType: 'differential' as const,
      }
    ];
  }
  
  // Default fallback for any other pages
  return [
    {
      id: 100 + pageNumber, // Dynamic unique ID
      title: `Question for page ${pageNumber}`,
      responseType: 'text' as const,
    }
  ];
};

export const useExamData = (pageNumber: number) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [caseInfo, setCaseInfo] = useState<string>('');
  const [examTitle, setExamTitle] = useState<string>('Medical Exam');
  const [currentPage, setCurrentPage] = useState<number>(pageNumber);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [availablePages, setAvailablePages] = useState<number[]>([1]);
  const [pageLoadError, setPageLoadError] = useState<boolean>(false);

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
      setPageLoadError(false);
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
        setPageLoadError(false);
        
        // Fetch the test information first
        const { data: testData, error: testError } = await supabase
          .from('tests')
          .select('*')
          .eq('test_id', 1)
          .single();
          
        if (testError) {
          console.error('Error fetching test data:', testError);
          setPageLoadError(true);
          throw testError;
        }
        
        if (testData) {
          setExamTitle(testData.test_name);
          
          // Check if case_info is an array and has content
          if (Array.isArray(testData.case_info) && testData.case_info.length > 0) {
            // Find the chunk for the current page
            const chunkIndex = pageNumber - 1; // Assuming 1-indexed pages
            
            if (chunkIndex >= 0 && chunkIndex < testData.case_info.length) {
              // Type assertion to handle the chunk properly
              const chunk = testData.case_info[chunkIndex] as unknown as ChunkContent;
              
              if (chunk && typeof chunk === 'object') {
                // Set case info content if available
                if ('content' in chunk && chunk.content) {
                  setCaseInfo(String(chunk.content));
                }
                
                // Handle questions if available
                if ('questions' in chunk && Array.isArray(chunk.questions)) {
                  console.log(`Fetched exam questions for page ${pageNumber}:`, chunk.questions);
                  setQuestions(chunk.questions);
                } else {
                  console.log(`No questions found in chunk for page ${pageNumber}, using fallbacks`);
                  // If no questions in the chunk, we'll use fallbacks below
                }
              } else {
                console.log(`Invalid chunk format for page ${pageNumber}`);
                setCaseInfo(`Case information for page ${pageNumber} is not available.`);
              }
            } else {
              console.log(`Page ${pageNumber} is out of range (total: ${testData.case_info.length})`);
              setCaseInfo(`Case information for page ${pageNumber} is not available.`);
              setPageLoadError(true);
            }
            
            // Set total pages based on number of chunks
            setTotalPages(testData.case_info.length);
          } else {
            console.error('Expected case_info to be a non-empty array, got:', typeof testData.case_info);
            setCaseInfo(`Case information is not available in the expected format.`);
            setPageLoadError(true);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load exam data');
        setPageLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [pageNumber]);

  // Use database questions if available, otherwise use fallbacks with unique IDs per page
  const displayQuestions = questions.length > 0 
    ? formatQuestionsForDisplay(questions) 
    : getFallbackQuestions(pageNumber);

  return {
    loading,
    examTitle,
    caseInfo,
    displayQuestions,
    totalPages,
    currentPage: pageNumber,
    availablePages,
    unlockNextPage,
    pageLoadError
  };
};
