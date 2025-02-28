
import Layout from "../components/Layout";
import ExamCard from "../components/ExamCard";

const FacultyHome = () => {
  return (
    <Layout 
      userType="faculty"
      userName="Dr. Christina Shenvi"
      email="cshenvi@med.unc.edu"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Home</h1>
          <p className="text-gray-600">Welcome Back, Dr. Shenvi.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ExamCard 
            title="Circulation Block CBL Final"
            subtitle="Active Exam"
            hours={2}
            questions={36}
            date="Aug 8"
            buttonText="Monitor"
            link="/faculty/exam/circulation-block"
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
