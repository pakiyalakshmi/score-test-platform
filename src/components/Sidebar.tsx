
import { Home, ClipboardCheck, PieChart, Settings, MessageSquare, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  userType: "student" | "faculty";
}

const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-clinicus-blue flex flex-col animate-slide-in">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-white rounded-full p-2 flex items-center justify-center">
          <div className="w-6 h-6 bg-clinicus-blue rounded-full"></div>
        </div>
        <h1 className="text-white text-xl font-semibold">Clinicus</h1>
      </div>
      
      <div className="flex-1 flex flex-col gap-2 p-3 mt-4">
        <Link to={`/${userType}`} className={`sidebar-item ${isActive(`/${userType}`) ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        
        <Link to={`/${userType}/tests`} className={`sidebar-item ${isActive(`/${userType}/tests`) ? 'active' : ''}`}>
          <ClipboardCheck size={20} />
          <span>Tests</span>
        </Link>
        
        <Link to={`/${userType}/results`} className={`sidebar-item ${isActive(`/${userType}/results`) ? 'active' : ''}`}>
          <PieChart size={20} />
          <span>Results</span>
        </Link>
        
        <Link to={`/${userType}/options`} className={`sidebar-item ${isActive(`/${userType}/options`) ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Options</span>
        </Link>
      </div>
      
      <div className="p-3 border-t border-white/10">
        <Link to={`/${userType}/feedback`} className={`sidebar-item ${isActive(`/${userType}/feedback`) ? 'active' : ''}`}>
          <MessageSquare size={20} />
          <span>Feedback</span>
        </Link>
        
        <Link to="/login" className="sidebar-item">
          <LogOut size={20} />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
