import { Box, Text } from "@chakra-ui/react";
import React from "react";

import { UserType } from "../../types/userTypes";
import { UploadFile } from "./uploadFile";
import { SetResurrection } from "./setResurrection";
import { useSelector } from "../../store";
import { GenerateRecipientPDF } from "./GenerateRecipientPDF";

export const ClientDashboard: React.FC = () => {
  const appUser = useSelector((x) => x.userState.user);
  return appUser?.type === UserType.embalmer ? (
    <Box>
      <Text>You are not authorized to view this page.</Text>
    </Box>
  ) : (
    <Box>
      <UploadFile />
      <SetResurrection mb={10} />
      <GenerateRecipientPDF />
    </Box>
  );
};
