import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./login";
import { RouteKey, RoutesPathMap } from "./routerConstants";
import { NotFoundPage } from "./notFound";
import { EmbalmerDashboard } from "./embalmer/dashboard";
import { ClientDashboard } from "./client/dashboard";
import { ClientOnboarding } from "./client/onboarding";
import React, { useEffect } from "react";
import { useSelector } from "../store";
import { TestUpload } from "./client/testUpload";
import { Box, Flex, Link } from "@chakra-ui/react";
import { Navbar } from "./navbar";
import { Sarcophagi } from "./sarcophagi";
import { SarcophagusDetailsPage } from "./sarcophagi/SarcophagusDetailsPage";

export function AppRoutes() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routes: any[] = [
    {
      path: RoutesPathMap[RouteKey.TEST_PAGE],
      element: <TestUpload />,
      label: "Test",
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.HOME_PAGE],
      element: <Login />,
      label: "Home",
    },
    {
      path: RoutesPathMap[RouteKey.LOGIN_PAGE],
      element: <Login />,
      label: "Login",
      hidden: true,
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
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.CLIENT_DASHBOARD_PAGE],
      element: <ClientDashboard />,
      label: "Client Dashboard",
    },
    {
      path: RoutesPathMap[RouteKey.SARCOPHAGI_PAGE],
      element: <Sarcophagi />,
      label: "Your Sarcophagi",
    },
    {
      path: RoutesPathMap[RouteKey.SARCOPHAGUS_DETAIL],
      element: <SarcophagusDetailsPage />,
      label: "Sarcophagus Details",
      hidden: true,
    },
  ];

  const navigate = useNavigate();
  const appUser = useSelector((x) => x.userState.user);

  useEffect(() => {
    if (!appUser) navigate("/login", { replace: true });
  }, [appUser, navigate]);

  return (
    <Flex direction="column" height="100vh" overflow="hidden">
      <Navbar>
        <Flex justifyContent="space-between" width="100%">
          <Flex alignItems="center">
            {routes.map((route) => (
              <Link
                textDecor="bold"
                as={NavLink}
                mx={1.5}
                bgColor={route.noBackground ? "transparent" : "blue.1000"}
                _activeLink={{
                  color: "brand.950",
                  bgColor: route.noBackground ? "transparent" : "blue.700",
                }}
                _hover={{ textDecor: "none", color: "brand.700" }}
                to={route.path}
                hidden={route.hidden}
                key={route.path}
              >
                <Box px={route.noBackground ? 0 : 5} py={route.noBackground ? 0 : 2.5}>
                  {route.label}
                </Box>
              </Link>
            ))}
          </Flex>
        </Flex>
      </Navbar>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Flex>
  );
}
