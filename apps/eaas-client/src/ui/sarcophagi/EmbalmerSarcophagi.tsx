import { useEffect, useState } from "react";
import { Center, Flex, Spinner, TabPanel, TabPanels, Tabs, Text, useToast } from "@chakra-ui/react";
import { NoSarcpohagi } from "./components/NoSarcophagi";
import { SarcoTable } from "./components/SarcoTable";

import { getUserSarcophagi } from "api/sarcophagi";
import { useDispatch, useSelector } from "store";
import { setUserSarcophagi } from "store/sarcophagi/actions";
import { getUserSarcophagiFailed } from "utils/toast";

export function EmbalmerSarcophagi() {
  const [isLoadingSarcophagi, setIsLoadingSarcophagi] = useState(false);
  const [loadedSarcophagi, setLoadedSarcophagi] = useState(false);

  const toast = useToast();

  const dispatch = useDispatch();
  const { userSarcophagi } = useSelector((state) => state.sarcophagiState);

  useEffect(() => {
    if (!loadedSarcophagi) {
      setIsLoadingSarcophagi(true);

      getUserSarcophagi()
        .then(async (res) => {
          dispatch(setUserSarcophagi(res));
          setIsLoadingSarcophagi(false);
          setLoadedSarcophagi(true);
        })
        .catch((err) => {
          toast(getUserSarcophagiFailed(err));
          setIsLoadingSarcophagi(false);
        });
    }
  }, [dispatch, loadedSarcophagi, toast]);

  function embalmerPanel() {
    if (userSarcophagi.length === 0 && isLoadingSarcophagi) {
      return (
        <Center my={16}>
          <Spinner size="xl" />
        </Center>
      );
    }

    if (loadedSarcophagi && userSarcophagi?.length === 0) {
      return <NoSarcpohagi />;
    }

    return <SarcoTable sarcophagi={userSarcophagi} />;
  }

  return (
    <Flex direction="column" w="100%" h="100%">
      <Flex
        cursor={"pointer"}
        justify="center"
        w="100%"
        bg="whiteAlpha.400"
        py={3}
      >
        <Text>MY SARCOPHAGI</Text>
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
          <TabPanel h="100%">{embalmerPanel()}</TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
