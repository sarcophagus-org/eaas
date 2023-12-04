export enum RouteKey {
  HOME_PAGE,
  LOGIN_PAGE,
  FORGOT_PASSWORD_PAGE,
  RESET_PASSWORD_PAGE,
  CLAIM_PAGE,
  EMBALMER_DASHBOARD_PAGE,
  CLIENT_DASHBOARD_PAGE,
  CLIENT_ONBOARDING_PAGE,
  SARCOPHAGI_PAGE,
  SARCOPHAGUS_DETAIL,
}

export const RoutesPathMap: { [key: number]: string } = {
  [RouteKey.HOME_PAGE]: "/",
  [RouteKey.LOGIN_PAGE]: "/login",
  [RouteKey.FORGOT_PASSWORD_PAGE]: "/forgot-password",
  [RouteKey.RESET_PASSWORD_PAGE]: "/reset-password",
  [RouteKey.CLAIM_PAGE]: "/claim",
  [RouteKey.EMBALMER_DASHBOARD_PAGE]: "/dashboard/embalmer",
  [RouteKey.CLIENT_DASHBOARD_PAGE]: "/dashboard/client",
  [RouteKey.CLIENT_ONBOARDING_PAGE]: "/onboard",
  [RouteKey.SARCOPHAGI_PAGE]: "/sarcophagi",
  [RouteKey.SARCOPHAGUS_DETAIL]: "/sarcophagi/:id",
};
