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
    <div>
      <Outlet />
      <Toaster />
    </div>
  );
};

export default Layout;
