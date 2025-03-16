
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ExamCard from "../components/ExamCard";
import { getAllAnswers } from "../utils/examAnswers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const TestsPage = () => {
  const navigate = useNavigate();
  const [hasUnfinishedExam, setHasUnfinishedExam] = useState(false);
  
  useEffect(() => {
    // Check if there are any saved answers in localStorage
    const savedAnswers = getAllAnswers();
    setHasUnfinishedExam(Object.keys(savedAnswers).length > 0);
  }, []);

  return (
    <Layout
      userType="student"
      userName="Arvind Rajan"
      email="arvind_rajan@med.unc.edu"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tests</h1>
          <p className="text-gray-600">Manage your exams and assessments.</p>
        </div>
        
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="available">Available Tests</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Tests</TabsTrigger>
            <TabsTrigger value="past">Past Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                subtitle="Available Now"
                hours={2}
                questions={36}
                date="Due Aug 8"
                link="/exam/1"
                buttonText="Start"
              />
              
              <ExamCard 
                title="Circulation Practice Questions"
                subtitle="Practice Test"
                hours={1.5}
                questions={25}
                link="/student/practice/circulation"
                buttonText="Practice"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ExamCard 
                title="Respiratory Block CBL"
                subtitle="Upcoming Exam"
                hours={2}
                questions={40}
                date="Available Aug 22"
                link="/student"
                buttonText="View"
              />
              
              <ExamCard 
                title="Neurology Midterm"
                subtitle="Upcoming Exam"
                hours={3}
                questions={60}
                date="Available Sep 15"
                link="/student"
                buttonText="View"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ExamCard 
                title="Molecules to Cells CBL Final"
                subtitle="Completed"
                percentage={96}
                link="/student/results"
                buttonText="View Results"
              />
              
              <ExamCard 
                title="Anatomy Practical"
                subtitle="Completed"
                percentage={88}
                link="/student/results"
                buttonText="View Results"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TestsPage;
