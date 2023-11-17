import React from "react";
import { Button, Container, Spinner, Text, useToast } from "@chakra-ui/react";
import { testApi } from "../../api";
import { preparePayload } from "../../utils/prepare-payload";
import { useState } from "react";
import { sendPayload } from "../../api/embalm";

export const TestUpload = () => {
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
              await sendPayload({
                chainId: 11155111,
                preparedEncryptedPayload,
                resurrectionTime,
                threshold: 1,
              });

              toast({ title: "File uploaded", status: "success" });
            } catch (e) {
              toast({ title: `File upload failed: ${e}`, status: "error" });
              console.log(e);
            } finally {
              setIsUploading(false);
            }
          }}
        >
          <Text>Upload dummy payload</Text>
        </Button>
      ) : (
        <Spinner />
      )}
    </Container>
  );
};
