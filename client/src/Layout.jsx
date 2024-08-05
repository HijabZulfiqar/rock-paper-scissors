import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Navbar from "./components/Navbar";

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/get-started");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
      {/* Footer */}
    </div>
  );
};

export default Layout;
