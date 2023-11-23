import { useEffect, useState } from "react";
import { Center, Flex, Spinner, TabPanel, TabPanels, Tabs, Text, useToast } from "@chakra-ui/react";
import { NoSarcpohagi } from "./components/NoSarcophagi";
import { SarcoTable } from "./components/SarcoTable";
import { SarcophagusData, sarco } from "@sarcophagus-org/sarcophagus-v2-sdk-client";

import { useAccount } from "wagmi";
import { ConnectWalletButton } from "./components/ConnectWalletButton";
import { getClientSarcophagi } from "api/sarcophagi";
import { getClientSarcophagiFailed } from "utils/toast";

/**
 * A component that manages the app's sarcophagi. Should be styled to fit any container.
 */
export function EmbalmerSarcophagi() {
  const { address, isConnected: isWalletConnected } = useAccount();

  const [showSarcophagi, setShowSarcophagi] = useState(false);
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
    if (showSarcophagi && isWalletConnected && isSarcoInitialized && !loadedEmbalmerSarcophagi) {
      setIsLoadingEmbalmerSarcophagi(true);

      sarco.api.getEmbalmerSarcophagi(address!.toString()).then((res) => {
        setEmbalmerSarcophagi(res);
        setIsLoadingEmbalmerSarcophagi(false);
        setLoadedEmbalmerSarcophagi(true);
      });
    }
  }, [address, isSarcoInitialized, isWalletConnected, loadedEmbalmerSarcophagi, showSarcophagi]);

  function embalmerPanel() {
    if (isLoadingEmbalmerSarcophagi) {
      return (
        <Center my={16}>
          <Spinner size="xl" />
        </Center>
      );
    }

    if (isWalletConnected && !isLoadingEmbalmerSarcophagi && embalmerSarcophagi?.length === 0) {
      return <NoSarcpohagi />;
    }

    return !isWalletConnected ? (
      <ConnectWalletButton />
    ) : (
      <SarcoTable sarcophagi={embalmerSarcophagi} />
    );
  }

  return (
    <Flex direction="column" w="100%" h="100%">
      <Flex
        onClick={() => (!showSarcophagi ? setShowSarcophagi(true) : null)}
        cursor={"pointer"}
        justify="center"
        w="100%"
        bg="whiteAlpha.400"
        py={3}
      >
        <Text>{`${showSarcophagi ? "MY" : "VIEW"} SARCOPHAGI`}</Text>
      </Flex>
      <Tabs
        variant="enclosed"
        overflow="hidden"
        isFitted
        display="flex"
        flexDirection="column"
        border="1px solid"
        borderColor="whiteAlpha.300"
      >
        {showSarcophagi ? (
          <TabPanels
            overflow="hidden"
            bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.09) 100%);"
          >
            <TabPanel h="100%">{embalmerPanel()}</TabPanel>
          </TabPanels>
        ) : null}
      </Tabs>
    </Flex>
  );
}

export function ClientSarcophagi() {
  const [isLoadingSarcophagi, setIsLoadingSarcophagi] = useState(false);
  const [loadedSarcophagi, setLoadedSarcophagi] = useState(false);
  const [clientSarcophagi, setClientSarcophagi] = useState<SarcophagusData[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (!loadedSarcophagi) {
      setIsLoadingSarcophagi(true);

      getClientSarcophagi().then((res) => {
        setClientSarcophagi(res);
        setIsLoadingSarcophagi(false);
        setLoadedSarcophagi(true);
      }).catch((err) => {
        toast(getClientSarcophagiFailed(err))
        setIsLoadingSarcophagi(false);
      });
    }
  }, [loadedSarcophagi, toast]);

   function sarcophagiPanel() {
    if (isLoadingSarcophagi) {
      return (
        <Center my={16}>
          <Spinner size="xl" />
        </Center>
      );
    }

    if (!isLoadingSarcophagi && clientSarcophagi?.length === 0) {
      return <NoSarcpohagi />;
    }

    return <SarcoTable sarcophagi={clientSarcophagi} />
  }

  return (
    <Flex direction="column" w="100%" h="100%">
      <Flex
        justify="center"
        w="100%"
        bg="whiteAlpha.400"
        py={3}
      >
        <Text>{"MY SARCOPHAGI"}</Text>
      </Flex>
      <Tabs
        variant="enclosed"
        overflow="hidden"
        isFitted
        display="flex"
        flexDirection="column"
        border="1px solid"
        borderColor="whiteAlpha.300"
      >
        <TabPanels
            overflow="hidden"
            bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.09) 100%);"
          >
            <TabPanel h="100%">{sarcophagiPanel()}</TabPanel>
          </TabPanels>
      </Tabs>
    </Flex>
  );
}
