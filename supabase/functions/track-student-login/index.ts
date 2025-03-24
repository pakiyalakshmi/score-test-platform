
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { student_id, action, ip_address, user_agent } = await req.json();
    
    if (!student_id) {
      return new Response(
        JSON.stringify({ error: "No student_id provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (action === 'login') {
      // Record login
      const { error } = await supabase
        .from('student_logins')
        .insert({
          student_id,
          ip_address,
          user_agent
        });
        
      if (error) {
        throw error;
      }
      
      console.log(`Recorded login for student ${student_id}`);
    } else if (action === 'logout') {
      // Update the latest login record with logout time
      const { data: loginRecords, error: fetchError } = await supabase
        .from('student_logins')
        .select('*')
        .eq('student_id', student_id)
        .order('login_time', { ascending: false })
        .limit(1);
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (loginRecords && loginRecords.length > 0) {
        const latestLogin = loginRecords[0];
        
        // Only update if logout_time is null
        if (!latestLogin.logout_time) {
          const { error: updateError } = await supabase
            .from('student_logins')
            .update({ logout_time: new Date().toISOString() })
            .eq('id', latestLogin.id);
            
          if (updateError) {
            throw updateError;
          }
          
          console.log(`Recorded logout for student ${student_id}`);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ status: "success" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error tracking student login:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
