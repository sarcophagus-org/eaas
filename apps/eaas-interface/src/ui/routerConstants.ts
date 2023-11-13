export enum RouteKey {
  HOME_PAGE,
  LOGIN_PAGE,
  EMBALMER_DASHBOARD_PAGE,
  CLIENT_DASHBOARD_PAGE,
  CLIENT_ONBOARDING_PAGE,
}

export const RoutesPathMap: { [key: number]: string } = {
  [RouteKey.HOME_PAGE]: "/",
  [RouteKey.LOGIN_PAGE]: "/login",
  [RouteKey.EMBALMER_DASHBOARD_PAGE]: "/dashboard/embalmer",
  [RouteKey.CLIENT_DASHBOARD_PAGE]: "/dashboard/client",
  [RouteKey.CLIENT_ONBOARDING_PAGE]: "/onboard",
};
