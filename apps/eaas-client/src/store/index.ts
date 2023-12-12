import { createContext, useContext } from "react";
import { EmbalmActions } from "./embalm/actions";
import { EmbalmState, embalmInitialState, embalmReducer } from "./embalm/reducer";
import { UserActions } from "./user/actions";
import { UserState, userInitialState, userReducer } from "./user/reducer";
import { SarcophagiActions } from "./sarcophagi/actions";
import { SarcophagiState, sarcophagiInitialState, sarcophagiReducer } from "./sarcophagi/reducer";

export type Actions = UserActions | EmbalmActions | SarcophagiActions;

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
  userState: UserState;
  embalmState: EmbalmState;
  sarcophagiState: SarcophagiState;
}

export const initialState: RootState = {
  userState: userInitialState,
  embalmState: embalmInitialState,
  sarcophagiState: sarcophagiInitialState,
};

export function storeReducer(state: RootState, action: Actions): RootState {
  return {
    userState: userReducer(state.userState, action),
    embalmState: embalmReducer(state.embalmState, action),
    sarcophagiState: sarcophagiReducer(state.sarcophagiState, action),
  };
}
