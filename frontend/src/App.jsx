import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { Buy } from "./pages/Buy.jsx";
import { Invest } from "./pages/Invest.jsx";
import { Sell } from "./pages/Sell.jsx";
import { AppLayout } from "./components/Layout/AppLayout.jsx";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import { Rent } from "./pages/Rent.jsx";
import SignIn from "./pages/Signin.jsx";
import SignUp from "./pages/Signup.jsx";
import Wanted from "./pages/Wanted.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AreaGuide from "./pages/AreaGuide.jsx";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "buy",
        element: <Buy />,
      },
      {
        path: "invest",
        element: <Invest />,
      },
      {
        path: "sell",
        element: <Sell />,
      },
      {
        path: "rent",
        element: <Rent />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "wanted",
        element: <Wanted />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "area-guide/:city/:area",
        element: <AreaGuide />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
