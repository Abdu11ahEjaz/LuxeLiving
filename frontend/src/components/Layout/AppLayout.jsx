import { Outlet } from "react-router-dom";
import { Headers } from "../UI/Headers.jsx";
import { Footers } from "../UI/Footers.jsx";
import Footerimg from '../../components/UI/Footerimg.jsx';

export const AppLayout = () => {
  return (
    <div className="overflow-x-hidden">
      <Headers />
      <Outlet />
      <Footers />
      <Footerimg />
    </div>
  );
};
