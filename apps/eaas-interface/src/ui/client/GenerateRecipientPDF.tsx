import React from "react";
import { VStack, Button, Text, Textarea, useToast, Spinner } from "@chakra-ui/react";
import { useGenerateRecipientPDF } from "../../hooks/useGenerateRecipientPDF";
import { GeneratePDFState } from "../../store/embalm/actions";
import { useSelector } from "../../store";
import { useEffect } from "react";
import { sendPayload } from "../../api/embalm";
import { preparePayload } from "../../utils/prepare-payload";

export function GenerateRecipientPDF() {
  const { generatePublicKey, downloadRecipientPDF, isLoading, generateError } =
    useGenerateRecipientPDF();

  const user = useSelector((x) => x.userState.user);
  const { resurrection, file, recipientState } = useSelector((x) => x.embalmState);

  const toast = useToast();

  const [isUploading, setIsUploading] = React.useState(false);

  useEffect(() => {
    if (generateError) {
      toast({
        title: "Error while generating",
        description: generateError,
        status: "error",
      });
    }
  }, [generateError, toast]);

  function handleGeneratePDFClick(): void {
    if (!resurrection || !file) {
      toast({
        title: "Almost there!",
        description: "Select a file and set a resurrection time for your upload",
        status: "warning",
      });
      return;
    }

    generatePublicKey();
  }

  useEffect(() => {
    if (recipientState.generatePDFState === GeneratePDFState.GENERATED) {
      toast({
        title: "Generated PDF. Downloading...",
        description: recipientState.generatePDFState,
        status: "success",
      });

      downloadRecipientPDF(user!.email);
    }
  }, [downloadRecipientPDF, recipientState.generatePDFState, toast, user]);

  const generateStateMap = {
    [GeneratePDFState.UNSET]: (
      <VStack align="left" spacing={4}>
        <Button width="fit-content" onClick={handleGeneratePDFClick} isLoading={isLoading}>
          Generate a new public key
        </Button>
        <Text>
          When you click this, it will generate a new wallet and public key. Send the downloadable
          PDF to the recipient.
        </Text>
        {/* {generateError && (
          <SarcoAlert status="error" title="Error while generating">
            {generateError}
          </SarcoAlert>
        )} */}
      </VStack>
    ),
    [GeneratePDFState.DOWNLOADED]: (
      <VStack spacing={6} w="100%">
        <Text fontSize="xl">Download PDF</Text>
        <Text align="center">
          Your recipient file has been downloaded. You will need to send this securely to your
          recipient. Do not store this online or let anyone else see it!
        </Text>
        {isUploading ? (
          <Spinner />
        ) : (
          <Button
            w="100%"
            onClick={async () => {
              try {
                const preparedEncryptedPayload = await preparePayload({
                  file: file!,
                  nArchs: 1,
                  recipientPublicKey: recipientState.publicKey,
                });

                setIsUploading(true);
                await sendPayload({
                  resurrectionTime: resurrection,
                  preparedEncryptedPayload,
                  threshold: 1,
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                toast({
                  title: "Error while uploading",
                  description: e,
                  status: "error",
                });
              } finally {
                setIsUploading(false);
              }
            }}
          >
            Upload File
          </Button>
        )}

        <Textarea disabled value={recipientState.publicKey} resize="none" />
      </VStack>
    ),
  };

  return (
    <VStack spacing={0}>
      {generateStateMap[recipientState.generatePDFState || GeneratePDFState.UNSET]}
    </VStack>
  );
}
