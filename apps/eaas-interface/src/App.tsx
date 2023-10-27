import { Button, ChakraProvider, Text, useToast } from "@chakra-ui/react";
import { sendPayload, testApi } from "./utils/api";
import { preparePayload } from "./utils/prepare-payload";

function App() {
  const toast = useToast();
  return (
    <ChakraProvider>
      <Text>Emabalmer-X</Text>
      <Button
        onClick={async () => {
          toast({
            title: await testApi(),
          });
        }}
      >
        <Text>test</Text>
      </Button>

      <Button
        onClick={async () => {
          const file = new File(["Hello"], "hello.txt", { type: "text/plain" });
          const recipientPublicKey =
            "0x04848ae25e147c8f16e84d058f94b7c52babc0254321fb3dc3cf21ed53f9ee0e555ed2ba5110649f506c3dea5d5c9bf1a1b6c905739d5346c6179aa28f1fe364b1";

          const preparedEncryptedPayload = await preparePayload({
            file,
            nArchs: 1,
            recipientPublicKey,
          });

          const resurrectionTime = Date.now() + 1_800_000; // +30mins

          const sendSuccess = await sendPayload({
            chainId: 11155111,
            preparedEncryptedPayload,
            resurrectionTime,
            sarcophagusName: "test sarco",
            threshold: 1,
          });

          toast({ title: sendSuccess });
        }}
      >
        <Text>Prepare payload</Text>
      </Button>
    </ChakraProvider>
  );
}

export default App;
