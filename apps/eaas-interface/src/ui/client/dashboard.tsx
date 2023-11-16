import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

import { UserType } from "../../types/userTypes";
import { UploadFile } from "./uploadFile";
import { SetResurrection } from "./setResurrection";
import { useSelector } from "../../store";

export const ClientDashboard: React.FC = () => {
  const appUser = useSelector((x) => x.userState.user);
  return appUser?.type === UserType.embalmer ? (
    <Box>
      <Text>You are not authorized to view this page.</Text>
    </Box>
  ) : (
    <Box>
      <Heading as="h1" size="xl">
        Client Dashboard
      </Heading>
      <Text>Your Profile: {appUser?.email}</Text>

      <UploadFile />
      <SetResurrection />
    </Box>
  );
};
