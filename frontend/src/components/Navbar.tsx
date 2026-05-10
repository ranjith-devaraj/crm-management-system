import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Props = {
  onMenuClick: () => void;
};

export default function Navbar({ onMenuClick }: Props) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dynamic page title
  const getTitle = () => {
    if (location.pathname.includes("dashboard")) return "Dashboard";
    if (location.pathname.includes("customers")) return "Customers";
    if (location.pathname.includes("add")) return "Add Customer";
    return "CRM";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex items-center justify-between">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        
        {/* Mobile menu button */}
        <button
          className="md:hidden text-2xl"
          onClick={onMenuClick}
        >
          ☰
        </button>

        {/* Page Title */}
        <h2 className="font-semibold text-lg md:text-xl">
          {getTitle()}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 md:gap-4">
        
        {/* User Info */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm text-gray-500">
            {user?.role?.toUpperCase()}
          </span>
          <span className="text-xs text-gray-400 truncate max-w-[120px]">
            {user?.email}
          </span>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
          {user?.email?.charAt(0).toUpperCase()}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-black text-white px-3 md:px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}