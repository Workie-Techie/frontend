import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import PublicFooter from "../components/PublicFooter";

const PublicLayout = ({ tone = "light" }) => (
  <>
    <Navbar tone={tone} />
    <Outlet />
    <PublicFooter />
  </>
);

export default PublicLayout;
