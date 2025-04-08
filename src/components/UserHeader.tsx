
import { Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserHeaderProps {
  userName: string;
  email: string;
  avatarUrl?: string;
}

const UserHeader = ({ userName, email, avatarUrl }: UserHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: userName, email: email });
  
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserInfo({
            name: userName || session.user?.user_metadata?.full_name || 'User',
            email: session.user?.email || email
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    
    getUserInfo();
  }, [userName, email]);
  
  return (
    <div className="w-full p-4 flex items-center justify-between border-b">
      <div className="relative w-1/3">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          className="search-field w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-clinicus-blue focus:border-clinicus-blue"
          placeholder="Enter any topic like 'stable angina' to review completed questions"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium text-sm">{userInfo.name}</p>
            <p className="text-xs text-gray-500">{userInfo.email}</p>
          </div>
          
          <Avatar className="w-10 h-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={userInfo.name} />
            ) : (
              <AvatarFallback className="bg-clinicus-blue text-white">
                {userInfo.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
