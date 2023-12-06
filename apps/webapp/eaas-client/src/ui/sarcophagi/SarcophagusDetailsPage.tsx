import { Center, Flex } from "@chakra-ui/react";
import { SarcophagusDetailsContainer } from "./components/SarcophagusDetailsContainer";
import { SarcophagusDetails } from "./components/SarcophagusDetails";
import { useQuery } from "hooks/useQuery";
import { Rewrap } from "./components/Rewrap";
import { Claim } from "./components/Claim";

export function SarcophagusDetailsPage() {
  const query = useQuery();
  const currentAction = query.get("action");

  const actionComponentMap: { [key: string]: React.ReactNode } = {
    rewrap: <Rewrap />,
    claim: <Claim />,
  };

  return (
    <Center width="100%" height="100%">
      <Flex w="50%" h="75%" maxWidth="1200px" minWidth="700px" minHeight="400px">
        <SarcophagusDetailsContainer>
          {currentAction ? actionComponentMap[currentAction] : <SarcophagusDetails />}
        </SarcophagusDetailsContainer>
      </Flex>
    </Center>
  );
}
