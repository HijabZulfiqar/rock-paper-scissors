import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
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
      {/* <Navbar /> */}
      <Outlet />
      <Toaster />
      {/* Footer */}
    </div>
  );
};

export default Layout;
