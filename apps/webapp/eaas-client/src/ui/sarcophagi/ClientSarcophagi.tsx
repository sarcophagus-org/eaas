import { useEffect, useState } from "react";
import { Center, Flex, Spinner, TabPanel, TabPanels, Tabs, Text, useToast } from "@chakra-ui/react";
import { NoSarcpohagi } from "./components/NoSarcophagi";
import { SarcoTable } from "./components/SarcoTable";
import { getClientSarcophagi } from "api/sarcophagi";
import { getClientSarcophagiFailed } from "utils/toast";
import { useDispatch, useSelector } from "store";
import { setClientSarcophagi } from "store/sarcophagi/actions";

export function ClientSarcophagi() {
  const [isLoadingSarcophagi, setIsLoadingSarcophagi] = useState(false);
  const [loadedSarcophagi, setLoadedSarcophagi] = useState(false);

  const toast = useToast();

  const dispatch = useDispatch();
  const { clientSarcophagi } = useSelector((state) => state.sarcophagiState);

  useEffect(() => {
    if (!loadedSarcophagi) {
      setIsLoadingSarcophagi(true);

      getClientSarcophagi()
        .then((res) => {
          dispatch(setClientSarcophagi(res));
          setIsLoadingSarcophagi(false);
          setLoadedSarcophagi(true);
        })
        .catch((err) => {
          toast(getClientSarcophagiFailed(err));
          setIsLoadingSarcophagi(false);
        });
    }
  }, [dispatch, loadedSarcophagi, toast]);

  function sarcophagiPanel() {
    if (clientSarcophagi.length === 0 && isLoadingSarcophagi) {
      return (
        <Center my={16}>
          <Spinner size="xl" />
        </Center>
      );
    }

    if (loadedSarcophagi && clientSarcophagi.length === 0) {
      return <NoSarcpohagi />;
    }

    return <SarcoTable sarcophagi={clientSarcophagi} />;
  }

  return (
    <Flex direction="column" w="100%" h="100%">
      <Flex justify="center" w="100%" bg="whiteAlpha.400" py={3}>
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
