
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const calculateScore = (studentAnswers: Record<string, any>, questionData: any[]): any => {
  // This is a simplified scoring model - in a real app, you would compare to rubrics
  const scoreData = {
    totalScore: 0,
    maxPossibleScore: 0,
    questionScores: {},
    feedback: [],
  };

  // Map questions by ID for easier lookup
  const questionsById = questionData.reduce((acc, q) => {
    acc[q.question_id] = q;
    return acc;
  }, {});
  
  // Calculate scores for each answer
  Object.entries(studentAnswers).forEach(([questionId, answer]) => {
    const question = questionsById[questionId];
    if (!question) return;
    
    const pointsPossible = question.tot_points || 10; // Default to 10 points if not specified
    scoreData.maxPossibleScore += pointsPossible;
    
    // Very basic scoring - giving 60-95% of possible points randomly
    // In a real app, this would use more sophisticated evaluation
    const scorePercent = 0.6 + (Math.random() * 0.35);
    const points = Math.round(pointsPossible * scorePercent);
    
    scoreData.totalScore += points;
    scoreData.questionScores[questionId] = {
      score: points,
      maxScore: pointsPossible,
      percentage: Math.round(scorePercent * 100)
    };
    
    // Generate feedback based on response type
    if (question.responseType === 'differential' || 
        (question.answer_format && question.answer_format.type === 'differential')) {
      scoreData.feedback.push({
        questionId: questionId,
        feedback: "Good differential diagnosis, but consider including more life-threatening conditions."
      });
    } else if (question.responseType === 'table' || 
              (question.answer_format && question.answer_format.type === 'table')) {
      scoreData.feedback.push({
        questionId: questionId,
        feedback: "Your table responses show good clinical reasoning. Work on connecting findings more directly to diagnoses."
      });
    } else {
      scoreData.feedback.push({
        questionId: questionId,
        feedback: "Solid answer. Be more concise and focus on key clinical elements."
      });
    }
  });
  
  // Add general feedback
  scoreData.overallFeedback = "Overall, you demonstrated good clinical reasoning. Focus on prioritizing differential diagnoses better and connecting physical exam findings to specific conditions.";
  
  // Calculate percentage score
  scoreData.percentageScore = scoreData.maxPossibleScore > 0 
    ? Math.round((scoreData.totalScore / scoreData.maxPossibleScore) * 100) 
    : 0;
    
  return scoreData;
};

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request data
    const { answers, student_id, test_id = 1 } = await req.json();
    console.log(`Processing answers for student ${student_id}:`, answers);
    
    if (!answers || Object.keys(answers).length === 0) {
      return new Response(
        JSON.stringify({ error: "No answers provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all questions from the database to use for evaluation
    const { data: questions, error: questionsError } = await supabase
      .from('exam_questions')
      .select('*');
      
    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch questions for evaluation" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate the score
    const results = calculateScore(answers, questions);
    
    // Store the results in the database if student_id is provided
    if (student_id) {
      const { error: resultError } = await supabase
        .from('student_results')
        .upsert({
          student_id,
          test_id,
          score: results.totalScore,
          percentage_score: results.percentageScore,
          feedback: results.feedback
        }, { onConflict: 'student_id, test_id' });
        
      if (resultError) {
        console.error("Error storing exam results:", resultError);
      } else {
        console.log("Successfully stored exam results for student:", student_id);
      }
    }
    
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing exam results:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
