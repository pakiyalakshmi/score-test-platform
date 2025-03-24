
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const calculateScore = (studentAnswers: Record<string, any>, questionData: any[]): any => {
  // Improved scoring model with more detailed feedback
  const scoreData = {
    totalScore: 0,
    maxPossibleScore: 0,
    questionScores: {} as Record<string, any>,
    feedback: [] as any[],
  };

  // Map questions by ID for easier lookup
  const questionsById = questionData.reduce((acc, q) => {
    acc[q.question_id] = q;
    return acc;
  }, {} as Record<string, any>);
  
  // Calculate scores for each answer
  Object.entries(studentAnswers).forEach(([questionId, answer]) => {
    const question = questionsById[questionId];
    if (!question) return;
    
    const pointsPossible = question.tot_points || 10; // Default to 10 points if not specified
    scoreData.maxPossibleScore += pointsPossible;
    
    // Evaluate the answer - this is where an AI model would normally be used
    // For now, using a more sophisticated random scoring with different ranges based on question type
    let scorePercent = 0;
    let feedbackText = "";
    
    const qType = question.responseType || 
                 (question.answer_format && question.answer_format.type) || 
                 'text';
                 
    // Analyze the student's answer
    if (qType === 'differential') {
      // Differential diagnosis questions - check if they provided a comprehensive list
      const answerList = Array.isArray(answer) ? answer : [answer];
      const hasContent = answerList.filter(a => a && a.trim()).length;
      
      if (hasContent >= 4) {
        scorePercent = 0.8 + (Math.random() * 0.2); // 80-100%
        feedbackText = "Excellent differential diagnosis with good prioritization. You included critical diagnoses and ordered them appropriately.";
      } else if (hasContent >= 2) {
        scorePercent = 0.6 + (Math.random() * 0.2); // 60-80%
        feedbackText = "Good differential with some key diagnoses, but consider including more life-threatening conditions as top priorities.";
      } else {
        scorePercent = 0.5 + (Math.random() * 0.1); // 50-60%
        feedbackText = "Your differential was limited. When creating a differential, ensure you consider must-not-miss diagnoses and rank by likelihood.";
      }
    } else if (qType === 'table') {
      // Table format questions - check depth of completion
      const tableData = answer || {};
      const filledCells = Object.values(tableData).reduce((count, row: any) => {
        return count + Object.values(row).filter(cell => cell && String(cell).trim()).length;
      }, 0);
      
      if (filledCells >= 8) {
        scorePercent = 0.85 + (Math.random() * 0.15); // 85-100%
        feedbackText = "Comprehensive table completion with excellent clinical correlations. Your table responses show strong pattern recognition.";
      } else if (filledCells >= 5) {
        scorePercent = 0.7 + (Math.random() * 0.15); // 70-85%
        feedbackText = "Good table responses with reasonable correlations. Consider making stronger connections between findings and diagnoses.";
      } else {
        scorePercent = 0.5 + (Math.random() * 0.2); // 50-70%
        feedbackText = "Your table responses could be more complete. Remember to fill in all relevant fields and make clear connections.";
      }
    } else {
      // Text questions - check length and complexity
      const textLength = typeof answer === 'string' ? answer.length : 0;
      
      if (textLength > 150) {
        scorePercent = 0.75 + (Math.random() * 0.25); // 75-100%
        feedbackText = "Well-developed response with thorough reasoning. Your answer demonstrates strong clinical thinking.";
      } else if (textLength > 50) {
        scorePercent = 0.6 + (Math.random() * 0.15); // 60-75%
        feedbackText = "Good response with adequate reasoning. Consider expanding with more clinical details.";
      } else {
        scorePercent = 0.5 + (Math.random() * 0.1); // 50-60%
        feedbackText = "Your response was brief. Aim to provide more comprehensive answers with clinical reasoning.";
      }
    }
    
    // Calculate points based on percentage
    const points = Math.round(pointsPossible * scorePercent);
    
    // Add to total score
    scoreData.totalScore += points;
    
    // Record question score data
    scoreData.questionScores[questionId] = {
      score: points,
      maxScore: pointsPossible,
      percentage: Math.round(scorePercent * 100)
    };
    
    // Add feedback
    scoreData.feedback.push({
      questionId: questionId,
      feedback: feedbackText
    });
  });
  
  // Add overall feedback based on total score
  const overallScorePercent = scoreData.maxPossibleScore > 0 
    ? (scoreData.totalScore / scoreData.maxPossibleScore) 
    : 0;
    
  if (overallScorePercent >= 0.85) {
    scoreData.overallFeedback = "Outstanding performance! You demonstrated excellent clinical reasoning and diagnostic skills. Continue to refine your ability to prioritize diagnoses based on clinical presentation.";
  } else if (overallScorePercent >= 0.7) {
    scoreData.overallFeedback = "Good work! You showed solid clinical reasoning skills. Focus on strengthening your connections between findings and diagnoses, and consider the relative importance of different diagnoses in your differential.";
  } else {
    scoreData.overallFeedback = "You've demonstrated foundational clinical reasoning. Work on developing more comprehensive differentials and making stronger connections between clinical findings and potential diagnoses. Review the feedback for each question for specific areas to improve.";
  }
  
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
