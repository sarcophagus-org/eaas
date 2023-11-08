import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./login";
import { RouteKey, RoutesPathMap } from "./routerConstants";
import { NotFoundPage } from "./notFound";
import Home from "./home";

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
