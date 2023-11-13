import { Button, Container, Spinner, Text, useToast } from "@chakra-ui/react";
import { testApi } from "../../api";
import { preparePayload } from "../../utils/prepare-payload";
import { useState } from "react";
import { sendPayload } from "../../api/embalm";

export const ClientHome = () => {
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Container>
      <Text>Emabalmer-X</Text>
      <Button
        onClick={async () => {
          toast({
            title: await testApi(),
            status: "success",
          });
        }}
      >
        <Text>test</Text>
      </Button>
      {!isUploading ? (
        <Button
          onClick={async () => {
            setIsUploading(true);
            const file = new File(["Hello"], "hello.txt", { type: "text/plain" });
            const recipientPublicKey =
              "0x04848ae25e147c8f16e84d058f94b7c52babc0254321fb3dc3cf21ed53f9ee0e555ed2ba5110649f506c3dea5d5c9bf1a1b6c905739d5346c6179aa28f1fe364b1";

            const preparedEncryptedPayload = await preparePayload({
              file,
              nArchs: 1,
              recipientPublicKey,
            });

            const resurrectionTime = Date.now() + 1_800_000; // +30mins

            try {
              const sendSuccess = await sendPayload({
                chainId: 11155111,
                preparedEncryptedPayload,
                resurrectionTime,
                sarcophagusName: "test sarco",
                threshold: 1,
              });

              console.log("sent", sendSuccess);

              if (sendSuccess) {
                toast({ title: "File uploaded", status: "success" });
              } else {
                toast({ title: "File upload failed", status: "error" });
              }
            } catch (e) {
              console.log(e);
            } finally {
              setIsUploading(false);
            }
          }}
        >
          <Text>Prepare payload</Text>
        </Button>
      ) : (
        <Spinner />
      )}
    </Container>
  );
};
