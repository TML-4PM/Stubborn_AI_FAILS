
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 flex items-center justify-center">
        <div className="container px-4 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <div className="text-9xl font-extrabold text-primary opacity-20 mb-6">404</div>
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full inline-flex items-center justify-center font-medium transition-all duration-300 hover:bg-primary/90"
            >
              Return to Home
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
