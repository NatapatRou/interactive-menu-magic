import { Home, LogIn, UserPlus, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LogIn, label: "Login", path: "/login" },
  { icon: UserPlus, label: "Register", path: "/register" },
  { icon: Info, label: "Information", path: "/info" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg animate-fadeIn">
      <div className="p-6 bg-hospital-primary text-white">
        <h2 className="text-xl font-semibold">Main Menu</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-6 py-4 text-gray-700 transition-all duration-300 hover:bg-gray-50 ${
                isActive ? "bg-gray-100 border-r-4 border-hospital-primary" : ""
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;