import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./login";
import { RouteKey, RoutesPathMap } from "./routerConstants";
import { NotFoundPage } from "./notFound";
import { EmbalmerDashboard } from "./embalmer/dashboard";
import { ClientDashboard } from "./client/dashboard";
import { ClientOnboarding } from "./client/onboarding";
import React, { useEffect } from "react";
import { useSelector } from "../store";

export function AppRoutes() {
  const routes = [
    {
      path: RoutesPathMap[RouteKey.HOME_PAGE],
      element: <Login />,
      label: "Home",
    },
    {
      path: RoutesPathMap[RouteKey.LOGIN_PAGE],
      element: <Login />,
      label: "Login",
    },
    {
      path: RoutesPathMap[RouteKey.EMBALMER_DASHBOARD_PAGE],
      element: <EmbalmerDashboard />,
      label: "Embalmer Dashboard",
    },
    {
      path: RoutesPathMap[RouteKey.CLIENT_ONBOARDING_PAGE],
      element: <ClientOnboarding />,
      label: "Client Onboarding",
    },
    {
      path: RoutesPathMap[RouteKey.CLIENT_DASHBOARD_PAGE],
      element: <ClientDashboard />,
      label: "Client Dashboard",
    },
  ];

  const navigate = useNavigate();
  const appUser = useSelector((x) => x.userState.user);

  useEffect(() => {
    if (!appUser) navigate("/login", { replace: true });
  }, [appUser, navigate]);

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
