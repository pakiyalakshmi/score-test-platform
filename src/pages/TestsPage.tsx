
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getAllAnswers } from "../utils/examAnswers";

const TestsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there are any saved answers and redirect to the appropriate page
    const savedAnswers = getAllAnswers();
    
    if (Object.keys(savedAnswers).length > 0) {
      // If there's an unfinished exam, redirect to it
      navigate("/exam/2");
    } else {
      // If no unfinished exam, redirect to the home page
      navigate("/student");
    }
  }, [navigate]);

  return (
    <Layout
      userType="student"
      userName="Arvind Rajan"
      email="arvind_rajan@med.unc.edu"
    >
      <div className="max-w-6xl mx-auto flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clinicus-blue"></div>
        <p className="ml-4 text-gray-600">Redirecting to your tests...</p>
      </div>
    </Layout>
  );
};

export default TestsPage;
