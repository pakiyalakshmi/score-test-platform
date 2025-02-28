
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center animate-scale-in">
        <h1 className="text-6xl font-bold text-clinicus-blue mb-6">404</h1>
        <p className="text-xl text-gray-600 mb-8">This page doesn't exist</p>
        <Link to="/" className="clinicus-button inline-flex items-center gap-2">
          <Home size={18} />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
