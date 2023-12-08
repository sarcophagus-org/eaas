import { useEffect, useState } from "react";
import { Center, Flex, Spinner, TabPanel, TabPanels, Tabs, Text, useToast } from "@chakra-ui/react";
import { NoSarcpohagi } from "./components/NoSarcophagi";
import { SarcoTable } from "./components/SarcoTable";
import { SarcophagusData } from "@sarcophagus-org/sarcophagus-v2-sdk-client";

import { getClientSarcophagi, getSarcoClientEmail } from "api/sarcophagi";
import { useDispatch, useSelector } from "store";
import { setClientSarcophagi } from "store/sarcophagi/actions";
import { getClientSarcophagiFailed } from "utils/toast";

export type SarcophagusDataWithClientEmail = SarcophagusData & { clientEmail?: string };

export function EmbalmerSarcophagi() {
  const [showSarcophagi, setShowSarcophagi] = useState(false);

  const [isLoadingSarcophagi, setIsLoadingSarcophagi] = useState(false);
  const [loadedSarcophagi, setLoadedSarcophagi] = useState(false);

  const toast = useToast();

  const dispatch = useDispatch();
  const { clientSarcophagi } = useSelector((state) => state.sarcophagiState);

  useEffect(() => {
    if (showSarcophagi && !loadedSarcophagi) {
      setIsLoadingSarcophagi(true);

      getClientSarcophagi()
        .then(async (res) => {
          const embalmerSarco: SarcophagusDataWithClientEmail[] = [];

          for await (const s of res) {
            try {
              const clientEmail = await getSarcoClientEmail(s.id);

              if (clientEmail !== "no client") {
                embalmerSarco.push({ ...s, clientEmail });
              }
            } catch (err) {
              console.error(err);
            }
          }

          dispatch(setClientSarcophagi(embalmerSarco));
          setIsLoadingSarcophagi(false);
          setLoadedSarcophagi(true);
        })
        .catch((err) => {
          toast(getClientSarcophagiFailed(err));
          setIsLoadingSarcophagi(false);
        });
    }
  }, [dispatch, loadedSarcophagi, showSarcophagi, toast]);

  function embalmerPanel() {
    if (isLoadingSarcophagi) {
      return (
        <Center my={16}>
          <Spinner size="xl" />
        </Center>
      );
    }

    if (loadedSarcophagi && clientSarcophagi?.length === 0) {
      return <NoSarcpohagi />;
    }

    return <SarcoTable sarcophagi={clientSarcophagi} />;
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
