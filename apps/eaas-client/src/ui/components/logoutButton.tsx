import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { useDispatch } from "../../store";
import { clearTokens, setInvites, setUser } from "../../store/user/actions";
import { setUserSarcophagi } from "store/sarcophagi/actions";
import { resetEmbalmState } from "store/embalm/actions";

export const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearTokens());
    dispatch(setUser(null));
    dispatch(setUserSarcophagi([]));
    dispatch(setInvites([]));
    dispatch(resetEmbalmState());
  };

  return (
    <Button p={0} onClick={handleLogout}>
      <Text mx={2} fontSize={14} color="black">
        Logout
      </Text>
    </Button>
  );
};
