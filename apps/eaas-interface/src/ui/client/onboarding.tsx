import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "../../hooks/useQuery";
// import { useParams } from "react-router-dom";

export const ClientOnboarding: React.FC = () => {
  const token = useQuery().get("token");
  console.log(token);

  return (
    <Box>
      <Heading as="h1" size="xl">
        Client Onboarding
      </Heading>
      <Text>{token}</Text>
    </Box>
  );
};
