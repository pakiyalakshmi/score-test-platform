
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export const saveAnswers = (answers: Record<string, any>) => {
  const storedAnswers = JSON.parse(localStorage.getItem('examAnswers') || '{}');
  const updatedAnswers = { ...storedAnswers, ...answers };
  localStorage.setItem('examAnswers', JSON.stringify(updatedAnswers));
  return updatedAnswers;
};

export const getAllAnswers = (): Record<string, any> => {
  return JSON.parse(localStorage.getItem('examAnswers') || '{}');
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
    // Transform answers to the format expected by the database
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: parseInt(questionId),
      student_answer: answer,
    }));
    
    // Note: student_answers table must exist in your Supabase database
    // This is a placeholder - in a real app you'd use the actual schema
    // Since this is just for demo, we'll continue without actually inserting
    console.log('Would submit these answers to database:', formattedAnswers);
    
    /* 
    // Uncomment this when student_answers table is available in the schema
    const { error } = await supabase
      .from('student_answers')
      .insert(formattedAnswers);
      
    if (error) {
      throw error;
    }
    */
    
    // After submission, we now call the calculate-exam-results function
    // But we don't need to wait for the results here, as we'll fetch them on the results page
    const { error } = await supabase.functions.invoke('calculate-exam-results', {
      body: { answers }
    });
    
    if (error) {
      console.error("Error calling calculate-exam-results:", error);
      // We'll continue even if there's an error, as the results page will try again
    }
    
    return true;
  } catch (err) {
    console.error('Error submitting answers:', err);
    return false;
  }
};

export const clearExamAnswers = () => {
  localStorage.removeItem('examAnswers');
};
