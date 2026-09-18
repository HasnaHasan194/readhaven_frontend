import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageLoader = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    
    // Simulate page loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="mt-4 text-black font-medium text-lg animate-pulse">Loading...</p>
        </div>
      )}
      {children}
    </>
  );
};

export default PageLoader;
