
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import UserHeader from "./UserHeader";

interface LayoutProps {
  children: ReactNode;
  userType: "student" | "faculty";
  userName: string;
  email: string;
  avatarUrl?: string;
}

const Layout = ({ children, userType, userName, email, avatarUrl }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userType={userType} />
      
      <div className="flex-1 flex flex-col">
        <UserHeader userName={userName} email={email} avatarUrl={avatarUrl} />
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
