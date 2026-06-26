import { Outlet } from "react-router-dom";
import { Headers } from "../UI/Headers";
import { Footers } from "../UI/Footers";
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
