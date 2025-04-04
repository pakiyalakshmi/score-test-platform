
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const FacultyHome = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get current authenticated user
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { email, user_metadata } = session.user;
        // Set user name from metadata if available, otherwise use email
        const displayName = user_metadata?.full_name || email?.split('@')[0] || "Faculty";
        setUserName(displayName);
        setUserEmail(email || "");
      }
    };
    
    getCurrentUser();
  }, []);
  
  return (
    <Layout 
      userType="faculty" 
      userName={userName || "Faculty"}
      email={userEmail || ""}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Faculty Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userName.split(' ')[0] || "Professor"}.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="py-10 flex items-center justify-center text-gray-400">
              <p>No recent activity to display</p>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Tests</h2>
            <div className="py-10 flex items-center justify-center text-gray-400">
              <p>No upcoming tests scheduled</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FacultyHome;
