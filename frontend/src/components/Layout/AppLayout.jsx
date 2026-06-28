import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Headers } from "../UI/Headers.jsx";
import { Footers } from "../UI/Footers.jsx";
import Footerimg from '../../components/UI/Footerimg.jsx';
import LoadingScreen from "../UI/LoadingScreen.jsx";
import { useLoading } from "../../context/LoadingContext.jsx";

export const AppLayout = () => {
  const { isLoading } = useLoading();
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show loading when navigating to pages OTHER than home (initial load)
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsPageLoading(true);
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500); // Show for 500ms during page transition
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div className="overflow-x-hidden">
      {(isLoading || isPageLoading) && <LoadingScreen />}
      <Headers />
      <Outlet />
      <Footers />
      <Footerimg />
    </div>
  );
};


