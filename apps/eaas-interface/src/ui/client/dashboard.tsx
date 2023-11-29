import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

import { UserType } from "../../types/userTypes";
import { UploadFile } from "./uploadFile";
import { SetResurrection } from "./setResurrection";
import { useSelector } from "../../store";

import { HStack } from "@chakra-ui/react";
import { LogoutButton } from "../login";
import { GenerateRecipientPDF } from "./GenerateRecipientPDF";

export const ClientDashboard: React.FC = () => {
  const appUser = useSelector((x) => x.userState.user);
  return appUser?.type === UserType.embalmer ? (
    <Box>
      <Text>You are not authorized to view this page.</Text>
    </Box>
  ) : (
    <Box>
      <HStack>
        <Heading as="h1" size="xl">
          Client Dashboard
        </Heading>
        <LogoutButton />
      </HStack>
      <HStack>
        <Text>Your Profile:</Text>
        <Text>{appUser?.email}</Text>
      </HStack>

      <UploadFile />
      <SetResurrection />
      <GenerateRecipientPDF />
    </Box>
  );
};
