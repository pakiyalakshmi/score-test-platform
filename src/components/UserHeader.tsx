
import { Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface UserHeaderProps {
  userName: string;
  email: string;
  avatarUrl?: string;
}

const UserHeader = ({ userName, email, avatarUrl }: UserHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [currentUser, setCurrentUser] = useState({ name: userName, email });
  
  // Verify the user information when component mounts or props change
  useEffect(() => {
    const verifyUser = async () => {
      // Only verify if we need to (if props seem empty or default)
      if (!userName || userName === "Faculty" || !email) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { email: userEmail, user_metadata } = session.user;
          const displayName = user_metadata?.full_name || userEmail?.split('@')[0] || userName;
          setCurrentUser({
            name: displayName,
            email: userEmail || email
          });
        }
      } else {
        // Use props if they seem valid
        setCurrentUser({ name: userName, email });
      }
    };
    
    verifyUser();
  }, [userName, email]);
  
  return (
    <div className="w-full p-4 flex items-center justify-between border-b">
      <div className="relative w-1/3">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          className="search-field w-full pl-10 pr-3 py-2 border rounded-md"
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
            <p className="font-medium text-sm">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{currentUser.email}</p>
          </div>
          
          <Avatar className="h-10 w-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={currentUser.name} />
            ) : (
              <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
