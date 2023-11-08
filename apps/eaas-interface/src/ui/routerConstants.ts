export enum RouteKey {
  HOME_PAGE,
  LOGIN_PAGE,
}

export const RoutesPathMap: { [key: number]: string } = {
  [RouteKey.HOME_PAGE]: "/",
  [RouteKey.LOGIN_PAGE]: "/login",
};
