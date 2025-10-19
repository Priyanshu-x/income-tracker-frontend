import { Link } from "react-router-dom";
import { Wallet, Sun, Moon, UserCircle } from "lucide-react"; // Using Lucide for icons
import { useTheme } from "../context/ThemeContext";

export function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <UserCircle className="h-8 w-8 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-gray-100 hidden md:block">User Name</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}