import React, { useEffect, useState } from "react";
import {
  Center,
  Flex,
  HStack,
  Icon,
  Spinner,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react";
// // import { useAccount } from "wagmi";
import { NoSarcpohagi } from "./components/NoSarcophagi";
// import { SarcoTab } from "./components/SarcoTab";
// import { SarcoTable } from "./components/SarcoTable";
// import { InfoOutlineIcon } from "@chakra-ui/icons";
import { SarcophagusData, sarco } from "@sarcophagus-org/sarcophagus-v2-sdk-client";
// import { useEffect, useState } from "react";
// import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';

/**
 * A component that manages the app's sarcophagi. Should be styled to fit any container.
 */
export function Sarcophagi() {
  // const { address } = useAccount();

  const [isLoadingEmbalmerSarcophagi, setIsLoadingEmbalmerSarcophagi] = useState(false);
  const [embalmerSarcophagi, setEmbalmerSarcophagi] = useState<SarcophagusData[]>([]);

  // const { isSarcoInitialized } = useSupportedNetwork();

  console.log("sarco.isInitialised", sarco);
  // console.log("sarco.isInitialised", sarco.isInitialised);
  // useEffect(() => {
  //   console.log("sarco.isInitialised", sarco.isInitialised);

  //   if (sarco.isInitialised) {
  //   // EMBALMER SARCO
  //   setIsLoadingEmbalmerSarcophagi(true);
  //   // if (!address) return;
  //   sarco.api.getEmbalmerSarcophagi("address").then((res) => {
  //     setEmbalmerSarcophagi(res);
  //     setIsLoadingEmbalmerSarcophagi(false);
  //   });
  //   }
  // }, [sarco.isInitialised]);

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

    // return <SarcoTable sarcophagi={embalmerSarcophagi} />;
  }

  return (
    <Flex direction="column" w="100%" h="100%">
      <Flex justify="center" w="100%" bg="whiteAlpha.400" py={3}>
        <Text>SARCOPHAGI</Text>
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
        <TabList border="none">
          {/* <SarcoTab>
            <HStack>
              <Text>My Sarcophagi</Text>
              <Tooltip label="Sarcophagi you have created." placement="top">
                <Icon as={InfoOutlineIcon} />
              </Tooltip>
            </HStack>
          </SarcoTab> */}
        </TabList>
        <TabPanels
          overflow="hidden"
          bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.09) 100%);"
        >
          <TabPanel h="100%">{embalmerPanel()}</TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
