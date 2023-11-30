import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Login, LogoutButton } from "./login";
import { RouteKey, RoutesPathMap } from "./routerConstants";
import { NotFoundPage } from "./notFound";
import { EmbalmerDashboard } from "./embalmer/dashboard";
import { ClientDashboard } from "./client/dashboard";
import { ClientOnboarding } from "./client/onboarding";
import { useEffect } from "react";
import { useSelector } from "../store";
import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { Navbar } from "./components/navbar";
import { SarcophagusDetailsPage } from "./sarcophagi/SarcophagusDetailsPage";
import { UserType } from "types/userTypes";
import { ClientSarcophagi } from "./sarcophagi/ClientSarcophagi";
import { Claim } from "./sarcophagi/components/Claim";

export function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const appUser = useSelector((x) => x.userState.user);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routes: any[] = [
    {
      path: RoutesPathMap[RouteKey.HOME_PAGE],
      element: !appUser ? (
        <Login />
      ) : appUser.type === UserType.embalmer ? (
        <EmbalmerDashboard />
      ) : (
        <ClientDashboard />
      ),
      label: "Dashboard",
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.LOGIN_PAGE],
      element: <Login />,
      label: "Login",
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.CLAIM_PAGE],
      element: <Claim />,
      label: "Claim Sarcophagus",
      hidden: true,
    },
    {
      path: RoutesPathMap[RouteKey.EMBALMER_DASHBOARD_PAGE],
      element: <EmbalmerDashboard />,
      label: "Dashboard",
      hidden: appUser?.type !== UserType.embalmer,
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
      label: "Dashboard",
      hidden: appUser?.type !== UserType.client,
    },
    {
      path: RoutesPathMap[RouteKey.SARCOPHAGI_PAGE],
      element: <ClientSarcophagi />,
      label: "Sarcophagi",
      hidden: appUser?.type !== UserType.client,
    },
    {
      path: RoutesPathMap[RouteKey.SARCOPHAGUS_DETAIL],
      element: <SarcophagusDetailsPage />,
      label: "Sarcophagus Details",
      hidden: true,
    },
  ];

  useEffect(() => {
    const isAuthorisedPath =
      location.pathname !== RoutesPathMap[RouteKey.LOGIN_PAGE] &&
      location.pathname !== RoutesPathMap[RouteKey.CLAIM_PAGE];
    if (isAuthorisedPath && !appUser) {
      navigate("/login", { replace: true });
    }

    if (location.pathname === RoutesPathMap[RouteKey.LOGIN_PAGE] && appUser) {
      navigate("/", { replace: true });
    }
  }, [appUser, navigate, location]);

  return (
    <Flex direction="column" height="100vh" overflow="hidden">
      {appUser && (
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
            <HStack>
              <Text fontSize={12}>Logged in as:</Text>
              <Text fontSize={12}>{appUser?.email}</Text>
              <LogoutButton />
            </HStack>
          </Flex>
        </Navbar>
      )}
      <Box alignSelf="center" my={10} width="1400px" maxW="90%">
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </Flex>
  );
}
