import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { ClientHome } from "./clientHome";

export const ClientDashboard: React.FC = () => {
  return (
    <Box>
      <Heading as="h1" size="xl">
        Client Dashboard
      </Heading>

      <ClientHome />
    </Box>
  );
};
