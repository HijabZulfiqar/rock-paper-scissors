import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { Toaster } from "sonner";
const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/get-started");
    }
  }, []);

  return (
    <div className="bg-bgFirst bg-gradient-to-r from-bgSecond to-bgFirst">
      <Outlet />
      <Toaster />
    </div>
  );
};

export default Layout;
