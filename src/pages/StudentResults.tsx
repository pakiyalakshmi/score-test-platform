
import Layout from "../components/Layout";
import CircleProgress from "../components/CircleProgress";
import ExamInsight from "../components/ExamInsight";
import { Clock, FileText, Calendar } from "lucide-react";

const StudentResults = () => {
  return (
    <Layout 
      userType="student"
      userName="Arvind Rajan"
      email="arvind_rajan@med.unc.edu"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Results</h1>
          <p className="text-gray-500">Circulation Block CBL Final</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Average Score</h3>
            <CircleProgress percentage={85} />
            <h2 className="text-4xl font-bold mt-2 text-clinicus-blue">85%</h2>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Review Previous Exam</h3>
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
              <button className="gold-button w-full">Results</button>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Individual Results</h3>
              <FileText size={18} className="text-gray-500" />
            </div>
            
            <div className="py-10 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-6">View your detailed performance</p>
                <button className="gold-button">Finalize</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 animate-fade-in">
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
      </div>
    </Layout>
  );
};

export default StudentResults;
