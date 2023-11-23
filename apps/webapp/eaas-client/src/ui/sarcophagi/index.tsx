import React, { useEffect, useState } from "react";
import {
  Center,
  Flex,
  HStack,
  Spinner,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { NoSarcpohagi } from "./components/NoSarcophagi";
import { SarcoTab } from "./components/SarcoTab";
import { SarcoTable } from "./components/SarcoTable";
import { SarcophagusData, sarco } from "@sarcophagus-org/sarcophagus-v2-sdk-client";

import { useAccount } from "wagmi";

/**
 * A component that manages the app's sarcophagi. Should be styled to fit any container.
 */
export function Sarcophagi() {
  const { address, isConnected: isWalletConnected } = useAccount();

  const [isLoadingEmbalmerSarcophagi, setIsLoadingEmbalmerSarcophagi] = useState(false);
  const [loadedEmbalmerSarcophagi, setLoadedEmbalmerSarcophagi] = useState(false);
  const [isSarcoInitialized, setIsSarcoInitialized] = useState(false);
  const [embalmerSarcophagi, setEmbalmerSarcophagi] = useState<SarcophagusData[]>([]);

  if (!isSarcoInitialized)
    sarco
      .init({
        chainId: 11155111,
        skipLibp2pNode: true,
      })
      .then((res) => setIsSarcoInitialized(true));

  useEffect(() => {
    console.log("sarco.isInitialised", sarco.isInitialised);

    if (isWalletConnected && isSarcoInitialized && !loadedEmbalmerSarcophagi) {
      // EMBALMER SARCO
      console.log("address", address);
      setIsLoadingEmbalmerSarcophagi(true);

      sarco.api.getEmbalmerSarcophagi(address!.toString()).then((res) => {
        setEmbalmerSarcophagi(res);
        setIsLoadingEmbalmerSarcophagi(false);
        setLoadedEmbalmerSarcophagi(true);
      });
    }
  }, [address, isSarcoInitialized, isWalletConnected, loadedEmbalmerSarcophagi]);

  function embalmerPanel() {
    if (isLoadingEmbalmerSarcophagi) {
      return (
        <Center my={16}>
          <Spinner size="xl" />
        </Center>
      );
    }

    if (!isLoadingEmbalmerSarcophagi && embalmerSarcophagi?.length === 0) {
      return <NoSarcpohagi />;
    }

    return <SarcoTable sarcophagi={embalmerSarcophagi} />;
  }

  return (
    <Flex direction="column" w="100%" h="100%">
      <Flex justify="center" w="100%" bg="whiteAlpha.400" py={3}>
        <Text>SARCOPHAGI</Text>
      </Flex>
      {!isWalletConnected ? (
        <Text>Connect Wallet</Text>
      ) : (
        <Tabs
          variant="enclosed"
          overflow="hidden"
          isFitted
          display="flex"
          flexDirection="column"
          border="1px solid"
          borderColor="whiteAlpha.300"
        >
          <TabList border="none">
            <SarcoTab>
              <HStack>
                <Text>My Sarcophagi</Text>
              </HStack>
            </SarcoTab>
          </TabList>
          <TabPanels
            overflow="hidden"
            bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.09) 100%);"
          >
            <TabPanel h="100%">{embalmerPanel()}</TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Flex>
  );
}
