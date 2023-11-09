export enum RouteKey {
  HOME_PAGE,
  LOGIN_PAGE,
  ADMIN_DASHBOARD_PAGE,
  CLIENT_DASHBOARD_PAGE
}

export const RoutesPathMap: { [key: number]: string } = {
  [RouteKey.HOME_PAGE]: "/",
  [RouteKey.LOGIN_PAGE]: "/login",
  [RouteKey.ADMIN_DASHBOARD_PAGE]: "/dashboard/admin",
  [RouteKey.CLIENT_DASHBOARD_PAGE]: "/dashboard/client",
};
