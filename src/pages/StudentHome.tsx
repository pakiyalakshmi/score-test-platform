
import Layout from "../components/Layout";
import ExamCard from "../components/ExamCard";

const StudentHome = () => {
  return (
    <Layout 
      userType="student"
      userName="Arvind Rajan"
      email="arvind_rajan@med.unc.edu"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Home</h1>
          <p className="text-gray-600">Welcome Back, Arvind.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ExamCard 
            title="Circulation Block CBL Final"
            subtitle="Upcoming Exam"
            hours={2}
            questions={36}
            date="Aug 8"
            link="/student/exam/circulation-block"
          />
          
          <ExamCard 
            title="Circulation Practice Questions"
            subtitle="Practice"
            percentage={75}
            link="/student/practice/circulation"
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
