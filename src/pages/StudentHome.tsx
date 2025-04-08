
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ExamCard from "../components/ExamCard";
import { getAllAnswers } from "../utils/examAnswers";
import { supabase } from "@/integrations/supabase/client";

const StudentHome = () => {
  const [hasUnfinishedExam, setHasUnfinishedExam] = useState(false);
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");
  
  useEffect(() => {
    // Check if there are any saved answers in localStorage
    const savedAnswers = getAllAnswers();
    setHasUnfinishedExam(Object.keys(savedAnswers).length > 0);
    
    // Get current user session
    const getUserInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || "Student");
        setUserEmail(session.user.email || "");
      }
    };
    
    getUserInfo();
  }, []);
  
  return (
    <Layout 
      userType="student"
      userName={userName}
      email={userEmail}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Home</h1>
          <p className="text-gray-600">Welcome Back, {userName.split(" ")[0]}.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {hasUnfinishedExam && (
            <ExamCard 
              title="Circulation Block CBL Final"
              subtitle="Continue Unfinished Exam"
              hours={1}
              questions={36}
              link="/exam/2"
              buttonText="Continue"
            />
          )}
          
          <ExamCard 
            title="Circulation Block CBL Final"
            subtitle="Upcoming Exam"
            hours={2}
            questions={36}
            date="Aug 8"
            link="/exam/1"
          />
          
          <ExamCard 
            title="Circulation Practice Questions"
            subtitle="Practice"
            percentage={75}
            link="/exam/1"
          />
          
          <ExamCard 
            title="Molecules to Cells CBL Final"
            subtitle="Review Previous Exam"
            percentage={96}
            date="Aug 1"
            link="/student/review/molecules-to-cells"
          />
        </div>
        
        <div className="glass-card p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Topics to Review</h2>
          <div className="py-10 flex items-center justify-center text-gray-400">
            <p>No review topics currently available</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentHome;
