import { Center, Flex } from "@chakra-ui/react";
import React from "react";
import { SarcophagusDetailsContainer } from "./components/SarcophagusDetailsContainer";
import { SarcophagusDetails } from "./components/SarcophagusDetails";

export function SarcophagusDetailsPage() {
  return (
    <Center width="100%" height="100%">
      <Flex w="50%" h="75%" maxWidth="1200px" minWidth="700px" minHeight="400px">
        <SarcophagusDetailsContainer>
          <SarcophagusDetails />
        </SarcophagusDetailsContainer>
      </Flex>
    </Center>
  );
}
