
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ExamCard from "../components/ExamCard";
import { supabase } from "@/integrations/supabase/client";

const FacultyHome = () => {
  const [userName, setUserName] = useState("Dr. Christina Shenvi");
  const [userEmail, setUserEmail] = useState("cshenvi@med.unc.edu");
  
  useEffect(() => {
    // Get current user session
    const getUserInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserName(session.user.user_metadata?.full_name || "Faculty");
          setUserEmail(session.user.email || "");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    
    getUserInfo();
  }, []);
  
  return (
    <Layout 
      userType="faculty"
      userName={userName}
      email={userEmail}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Home</h1>
          <p className="text-gray-600">Welcome Back, {userName.split(" ")[0]}.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ExamCard 
            title="Circulation Block CBL Final"
            subtitle="Active Exam"
            hours={2}
            questions={36}
            date="Aug 8"
            buttonText="Monitor"
            link="/exam/1"
          />
          
          <ExamCard 
            title="Circulation Practice Questions"
            subtitle="Practice Questions"
            percentage={100}
            buttonText="Edit"
            link="/faculty/practice/circulation"
          />
          
          <ExamCard 
            title="Create New Exam"
            subtitle="Exam Builder"
            buttonText="Create"
            link="/faculty/create-exam"
          />
        </div>
        
        <div className="glass-card p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Molecules to Cells Exam Completed</p>
                <p className="text-sm text-gray-500">36 students submitted</p>
              </div>
              <span className="text-sm text-gray-500">Aug 1</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Circulation Practice Questions Updated</p>
                <p className="text-sm text-gray-500">Added 5 new questions</p>
              </div>
              <span className="text-sm text-gray-500">Jul 28</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Circulation Block CBL Final Published</p>
                <p className="text-sm text-gray-500">Available to students Aug 8</p>
              </div>
              <span className="text-sm text-gray-500">Jul 25</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FacultyHome;
