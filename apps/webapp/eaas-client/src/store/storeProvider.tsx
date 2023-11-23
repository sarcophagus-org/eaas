import { useMemo, useReducer } from "react";
import { initialState, storeReducer, StoreContext } from ".";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const store = useMemo(() => ({ state, dispatch }), [state]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
