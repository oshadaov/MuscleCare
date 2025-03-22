"use client"

import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Calendar, Users, MessageSquare, Briefcase, Settings, LogOut, Mail,Video,Image} from "lucide-react"

const Sidebar = ({ onLogout }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/bookings", icon: Calendar, label: "Bookings" },
    { path: "/users", icon: Users, label: "Users" },
    { path: "/feedback", icon: MessageSquare, label: "Feedback" },
    { path: "/services", icon: Briefcase, label: "Services" },
    { path: "/contacts", icon: Mail, label: "Contact Submissions" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/videos", icon: Video, label: "Video" },
    { path: "/images", icon: Image, label: "Image" },
  ]

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Muscle Care Admin</h1>
      </div>

      <nav className="flex-1 py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm ${
                  isActive(item.path) ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <item.icon size={18} className="mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center text-gray-300 hover:text-white w-full px-4 py-2 text-sm"
        >
          <LogOut size={18} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar

