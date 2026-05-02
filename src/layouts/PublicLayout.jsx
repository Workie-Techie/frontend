import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

const PublicLayout = ({ tone = "light" }) => (
  <>
    <Navbar tone={tone} />
    <Outlet />
  </>
);

export default PublicLayout;
