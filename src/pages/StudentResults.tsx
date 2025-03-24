
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import CircleProgress from "../components/CircleProgress";
import ExamInsight from "../components/ExamInsight";
import { Clock, FileText, Calendar, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { getAllAnswers, initializeNewExam } from "../utils/examAnswers";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const StudentResults = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [feedbackExpanded, setFeedbackExpanded] = useState<Record<string, boolean>>({});
  const [completionTime, setCompletionTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        // Redirect to login if not logged in
        toast.error("Please log in to view your results");
        navigate("/login");
      }
    });

    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // Get user session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setLoading(false);
          return;
        }
        
        // First try to get results from the database
        const { data: storedResults, error } = await supabase
          .from('student_results')
          .select('*')
          .eq('student_id', session.user.id)
          .eq('test_id', 1)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching stored results:", error);
        }
        
        if (storedResults && storedResults.feedback) {
          console.log("Found stored results:", storedResults);
          setResults({
            totalScore: storedResults.score,
            percentageScore: storedResults.percentage_score,
            maxPossibleScore: storedResults.score * 100 / storedResults.percentage_score,
            feedback: storedResults.feedback,
            overallFeedback: "Based on your responses, here are areas to focus on for improvement."
          });
          
          // Get completion time from localStorage if available
          const storedTime = localStorage.getItem('examCompletionTime');
          if (storedTime) {
            setCompletionTime(storedTime);
          } else {
            // If no stored time, use the timestamp from the database
            setCompletionTime(new Date(storedResults.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }));
          }
          
          setLoading(false);
          return;
        }
        
        // If no stored results, calculate from answers
        const allAnswers = getAllAnswers();
        
        if (Object.keys(allAnswers).length === 0) {
          toast.error("No exam answers found");
          setLoading(false);
          return;
        }
        
        // Get completion time from localStorage if available
        const storedTime = localStorage.getItem('examCompletionTime');
        if (storedTime) {
          setCompletionTime(storedTime);
        } else {
          // If no stored time, use current time as fallback
          setCompletionTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        
        // Call the edge function to calculate results
        const { data, error: calcError } = await supabase.functions.invoke('calculate-exam-results', {
          body: { 
            answers: allAnswers,
            student_id: session.user.id,
            test_id: 1
          }
        });
        
        if (calcError) {
          console.error("Error calculating results:", calcError);
          toast.error("Failed to calculate exam results");
          setLoading(false);
          return;
        }
        
        console.log("Calculated results:", data);
        
        // Store the results in the database
        if (data) {
          const { error: saveError } = await supabase
            .from('student_results')
            .upsert({
              student_id: session.user.id,
              test_id: 1,
              score: data.totalScore,
              percentage_score: data.percentageScore,
              feedback: data.feedback
            }, { onConflict: 'student_id, test_id' });
            
          if (saveError) {
            console.error("Error saving results:", saveError);
          }
        }
        
        setResults(data);
      } catch (err) {
        console.error("Error fetching results:", err);
        toast.error("Failed to load exam results");
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [navigate]);

  const toggleFeedback = (id: string) => {
    setFeedbackExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleTryAgain = async () => {
    try {
      setIsSubmitting(true);
      
      // Clear existing exam data
      initializeNewExam();
      
      // Delete existing results if any
      if (userId) {
        await supabase
          .from('student_results')
          .delete()
          .eq('student_id', userId)
          .eq('test_id', 1);
      }
      
      toast.success("Ready for a new attempt");
      
      // Navigate back to exam
      navigate("/exam/1");
    } catch (error) {
      console.error("Error resetting exam:", error);
      toast.error("Failed to reset exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout 
      userType="student"
      userName="Arvind Rajan"
      email="arvind_rajan@med.unc.edu"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Results</h1>
            <p className="text-gray-500">Circulation Block CBL Final</p>
          </div>
          
          <Button 
            onClick={handleTryAgain}
            disabled={isSubmitting}
            className="flex items-center gap-2 gold-button"
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Try Again
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clinicus-blue"></div>
            <p className="ml-4 text-gray-600">Calculating your results...</p>
          </div>
        ) : !results ? (
          <div className="glass-card p-8 text-center">
            <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Results Available</h2>
            <p className="text-gray-600 mb-4">We couldn't find your exam answers. Please make sure you've completed the exam.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="glass-card p-6 flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Your Score</h3>
                <CircleProgress percentage={results.percentageScore} />
                <h2 className="text-4xl font-bold mt-2 text-clinicus-blue">{results.percentageScore}%</h2>
                <p className="text-gray-500 mt-2">{results.totalScore} out of {results.maxPossibleScore} points</p>
                {completionTime && (
                  <div className="flex items-center mt-3 text-gray-500">
                    <Clock size={16} className="mr-2" />
                    <span>Finished at {completionTime}</span>
                  </div>
                )}
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Previous Exam</h3>
                  <Clock size={18} className="text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Molecules to Cells CBL Final</h2>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-clinicus-blue">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">24 Q's</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Aug 1</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="gold-button w-full">View Details</button>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Completion Status</h3>
                  <CheckCircle2 size={18} className="text-green-500" />
                </div>
                
                <div className="py-10 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 mb-6">Your responses have been recorded</p>
                    <p className="text-sm text-gray-400">Completed on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Overall Feedback</h2>
              <p className="text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-100">
                {results.overallFeedback}
              </p>
            </div>
            
            <div className="glass-card p-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Question Feedback</h2>
              
              <div className="divide-y">
                {results.feedback.map((item: any, index: number) => (
                  <div key={index} className="py-4">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFeedback(`q-${item.questionId}`)}
                    >
                      <h3 className="font-medium">Question {item.questionId}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-clinicus-blue">
                          {results.questionScores[item.questionId]?.percentage || 0}%
                        </span>
                        <svg 
                          className={`h-5 w-5 transform transition-transform ${feedbackExpanded[`q-${item.questionId}`] ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {feedbackExpanded[`q-${item.questionId}`] && (
                      <div className="mt-3 text-gray-600 bg-gray-50 p-3 rounded-md">
                        {item.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card p-6 mt-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">AI Exam Insights</h2>
              
              <div className="divide-y">
                <ExamInsight 
                  insight="Students demonstrated mastery in developing a thorough differential diagnosis for chest pain."
                />
                <ExamInsight 
                  insight="Students commonly confused the mechanism of ITP, stating it was destruction of platelets by antibodies, rather than tagging them for splenic destruction."
                />
                <ExamInsight 
                  insight="Average student scores on coagulopathy questions were lower than their scores on ACS questions."
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default StudentResults;
