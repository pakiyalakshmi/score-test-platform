import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export const saveAnswers = async (answers: Record<string, any>) => {
  try {
    const storedAnswers = JSON.parse(localStorage.getItem('examAnswers') || '{}');
    const updatedAnswers = { ...storedAnswers, ...answers };
    localStorage.setItem('examAnswers', JSON.stringify(updatedAnswers));
    
    // Auto-save to backend if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // We're not awaiting this to keep it non-blocking
      supabase.functions.invoke('save-exam-progress', {
        body: { answers: updatedAnswers, student_id: session.user.id }
      }).catch(error => {
        console.error('Error auto-saving exam progress:', error);
      });
    }
    
    return updatedAnswers;
  } catch (error) {
    console.error('Error saving answers:', error);
    return {};
  }
};

export const getAllAnswers = (): Record<string, any> => {
  return JSON.parse(localStorage.getItem('examAnswers') || '{}');
};

export const getCurrentPageAnswers = (
  pageNumber: number, 
  displayQuestions: Array<{ id: number }>
): Record<string, any> => {
  const allAnswers = getAllAnswers();
  const pageAnswers: Record<string, any> = {};
  
  // Only include answers for questions on the current page
  displayQuestions.forEach(question => {
    if (allAnswers[question.id]) {
      pageAnswers[question.id] = allAnswers[question.id];
    }
  });
  
  return pageAnswers;
};

export const checkAllQuestionsAnswered = (
  displayQuestions: Array<{ id: number; responseType: string }>,
  answers: Record<string, any>
): boolean => {
  const allAnswered = displayQuestions.every(q => answers[q.id] && 
    (typeof answers[q.id] === 'string' ? answers[q.id].trim() !== '' : 
     Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true));
  
  if (!allAnswered) {
    toast.error("Please answer all questions before proceeding");
  }
  
  return allAnswered;
};

export const submitExamAnswers = async (answers: Record<string, any>): Promise<boolean> => {
  try {
    // Show toast to indicate submission is in progress
    toast.info("Submitting exam answers...");
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error("You must be logged in to submit exam answers");
      return false;
    }
    
    // Transform answers to the format expected by the database
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: parseInt(questionId),
      student_answer: answer,
    }));
    
    // Store the completion time
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem('examCompletionTime', currentTime);
    
    console.log('Submitting answers to database:', formattedAnswers);
    
    // Call the calculate-exam-results function
    const { data, error } = await supabase.functions.invoke('calculate-exam-results', {
      body: { 
        answers,
        student_id: session.user.id,
        test_id: 1 // Using test_id 1 for the CF case
      }
    });
    
    if (error) {
      console.error("Error calculating exam results:", error);
      toast.error("Error submitting exam results");
      return false;
    }
    
    // Store result in student_results table
    if (data) {
      const { error: resultError } = await supabase
        .from('student_results')
        .upsert({
          student_id: session.user.id,
          test_id: 1,
          score: data.totalScore,
          percentage_score: data.percentageScore,
          feedback: data.feedback
        }, { onConflict: 'student_id, test_id' });
        
      if (resultError) {
        console.error("Error storing exam results:", resultError);
        toast.error("Error saving results to database");
      } else {
        toast.success("Exam submitted successfully");
      }
    }
    
    // Clear answers after successful submission
    clearExamAnswers();
    
    return true;
  } catch (err) {
    console.error('Error submitting answers:', err);
    toast.error("Failed to submit exam answers");
    return false;
  }
};

export const clearExamAnswers = () => {
  localStorage.removeItem('examAnswers');
  localStorage.removeItem('availableExamPages');
  // Don't clear the completion time when clearing answers
  // as we want it to persist for the results page
};

// New function to initialize a new exam session
export const initializeNewExam = () => {
  clearExamAnswers();
  localStorage.removeItem('examCompletionTime'); // Clear completion time when starting a new exam
  console.log('Exam answers cleared - starting fresh exam');
};

// New function to check if user has active results
export const hasStoredResults = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('student_results')
      .select('id')
      .eq('student_id', userId)
      .eq('test_id', 1)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking for stored results:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking for stored results:', error);
    return false;
  }
};
