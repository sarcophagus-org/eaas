import React from "react";
import {
  Button,
  Text,
} from "@chakra-ui/react";
import { useDispatch } from "../../store";
import { clearTokens, setUser } from "../../store/user/actions";
import { setClientSarcophagi } from "store/sarcophagi/actions";

export const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearTokens());
    dispatch(setUser(null));
    dispatch(setClientSarcophagi([]));
  };

  return (
    <Button p={0} onClick={handleLogout}>
      <Text mx={2} fontSize={14} color="black">
        Logout
      </Text>
    </Button>
  );
};