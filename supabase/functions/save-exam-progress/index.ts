
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { answers, student_id } = await req.json();
    
    if (!student_id) {
      return new Response(
        JSON.stringify({ error: "No student_id provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!answers || Object.keys(answers).length === 0) {
      return new Response(
        JSON.stringify({ error: "No answers provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Auto-saving progress for student ${student_id}, answers count: ${Object.keys(answers).length}`);
    
    // Store the progress in the database
    // We'll use the student_id and the answers to create a record
    
    // Format answers for storage
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: parseInt(questionId),
      student_answer: answer,
    }));
    
    // Store in student_progress table (you may need to create this table)
    // This is a simplified implementation - in production you'd want to handle
    // updates to existing progress rather than always inserting
    
    const { data, error } = await supabase
      .from('student_results')
      .upsert({
        student_id,
        test_id: 1, // Using test_id 1 as default
        score: 0, // This will be calculated by calculate-exam-results
        percentage_score: 0, // This will be calculated by calculate-exam-results
        feedback: formattedAnswers
      }, { onConflict: 'student_id, test_id' });
      
    if (error) {
      console.error("Error saving progress:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ status: "success", message: "Progress saved" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error saving exam progress:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
