
import { Search, Bell } from "lucide-react";
import { useState } from "react";

interface UserHeaderProps {
  userName: string;
  email: string;
  avatarUrl?: string;
}

const UserHeader = ({ userName, email, avatarUrl }: UserHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  
  return (
    <div className="w-full p-4 flex items-center justify-between border-b">
      <div className="relative w-1/3">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          className="search-field"
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
            <p className="font-medium text-sm">{userName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-medium text-gray-600">{userName.charAt(0)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
