import { useState } from "react";
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

function Header({ sidebarOpen, setSidebarOpen }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-gray-500 focus:outline-none md:hidden"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 focus:outline-none">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          <div className="relative ml-4">
            <div className="relative inline-block text-left">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center text-gray-700 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="ml-2 text-sm font-medium hidden md:block">
                  {currentUser?.name || "Admin"}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </a>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
