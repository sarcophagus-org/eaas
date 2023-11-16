import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

import { appUser } from "../../store/tempMemoryStore";
import { UserType } from "../../types/userTypes";
import { UploadFile } from "./uploadFile";

export const ClientDashboard: React.FC = () => {
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
    </Box>
  );
};
