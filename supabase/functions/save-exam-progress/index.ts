
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    // In a real implementation, you would store the progress in a database
    // For now, we'll just log it and return success
    
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
