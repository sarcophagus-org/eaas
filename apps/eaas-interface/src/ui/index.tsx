import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./login";
import { RouteKey, RoutesPathMap } from "./routerConstants";
import { NotFoundPage } from "./notFound";
import Home from "./home";
import { AdminDashboard } from "./admin/dashboard";
import { ClientDashboard } from "./client/dashboard";

export function AppRoutes() {
  const routes = [
    {
      path: RoutesPathMap[RouteKey.HOME_PAGE],
      element: <Home />,
      label: "Home",
    },
    {
      path: RoutesPathMap[RouteKey.LOGIN_PAGE],
      element: <Login />,
      label: "Login",
    },
    {
      path: RoutesPathMap[RouteKey.ADMIN_DASHBOARD_PAGE],
      element: <AdminDashboard />,
      label: "Admin Dashboard",
    },
    {
      path: RoutesPathMap[RouteKey.CLIENT_DASHBOARD_PAGE],
      element: <ClientDashboard />,
      label: "Client Dashboard",
    },
  ];

  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
