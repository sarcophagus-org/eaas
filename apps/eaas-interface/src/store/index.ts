import { createContext, useContext } from "react";
import { EmbalmActions } from "./embalm/actions";
import { EmbalmState, embalmInitialState, embalmReducer } from "./embalm/reducer";

export type Actions =
  // | AppActions
  EmbalmActions;

interface Context {
  state: RootState;
  dispatch: React.Dispatch<Actions>;
}

export const StoreContext = createContext<Context>({} as Context);

export function useSelector<T>(select: (state: RootState) => T): T {
  const { state } = useContext(StoreContext);
  return select(state);
}

export function useDispatch(): React.Dispatch<Actions> {
  const { dispatch } = useContext(StoreContext);
  return dispatch;
}

export interface RootState {
  // appState: AppState;
  embalmState: EmbalmState;
}

export const initialState: RootState = {
  // appState: appInitialState,
  embalmState: embalmInitialState,
};

export function storeReducer(state: RootState, action: Actions): RootState {
  return {
    // appState: appReducer(state.appState, action),
    embalmState: embalmReducer(state.embalmState, action),
  };
}
