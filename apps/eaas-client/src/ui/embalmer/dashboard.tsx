import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { UserType } from "../../types/userTypes";
import { useSelector } from "../../store";
import { EmbalmerSarcophagi } from "ui/sarcophagi/EmbalmerSarcophagi";

export const EmbalmerDashboard: React.FC = () => {
  const appUser = useSelector((x) => x.userState.user);

  return appUser?.type === UserType.client ? (
    <Box>
      <Text>You are not authorized to view this page.</Text>
    </Box>
  ) : (
    <Box>
      <EmbalmerSarcophagi />
    </Box>
  );
};
