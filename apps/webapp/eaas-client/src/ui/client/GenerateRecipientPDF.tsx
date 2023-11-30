import React from "react";
import { VStack, Button, Text, Textarea, useToast, Spinner, Box } from "@chakra-ui/react";
import { useGenerateRecipientPDF } from "../../hooks/useGenerateRecipientPDF";
import { GeneratePDFState } from "../../store/embalm/actions";
import { useSelector } from "../../store";
import { useEffect } from "react";
import { sendPayload } from "../../api/embalm";
import { preparePayload } from "../../utils/preparePayload";
import { fileUploadFailure, fileUploadSuccess, generatePDFFailure } from "utils/toast";
import { useNavigate } from "react-router-dom";
import EmbalmStepHeader from "ui/components/embalmStepHeader";

export function GenerateRecipientPDF() {
  const { generatePublicKey, downloadRecipientPDF, isLoading, generateError } =
    useGenerateRecipientPDF();

  const user = useSelector((x) => x.userState.user);
  const { resurrection, file, recipientState } = useSelector((x) => x.embalmState);

  const toast = useToast();

  const [isUploading, setIsUploading] = React.useState(false);

  useEffect(() => {
    if (generateError) {
      toast(generatePDFFailure(generateError));
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
        title: "Generated PDF",
        status: "success",
      });

      downloadRecipientPDF(user!.email);
    }
  }, [downloadRecipientPDF, recipientState.generatePDFState, toast, user]);

  const navigate = useNavigate();

  const generateStateMap: Record<GeneratePDFState, any> = {
    [GeneratePDFState.UNSET]: (
      <VStack align="left" spacing={4}>
        <Button width="fit-content" onClick={handleGeneratePDFClick} isLoading={isLoading}>
          Generate Recipient PDF
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
                  recipientPublicKey: recipientState.publicKey,
                });

                setIsUploading(true);
                await sendPayload({
                  resurrectionTime: resurrection,
                  preparedEncryptedPayload,
                  sarcoId: recipientState.sarcoId,
                });
                toast(fileUploadSuccess());
                navigate("/");

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                toast(fileUploadFailure(e));
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
    [GeneratePDFState.GENERATED]: undefined,
  };

  return (
    <VStack w="100%" align="left" spacing={0}>
      <EmbalmStepHeader
        headerText="Create Recipient PDF"
        subText="When you click this, it will generate a new wallet and public key. Send the downloadable PDF to the recipient."
      />
      <Box h={3} />
      {generateStateMap[recipientState.generatePDFState || GeneratePDFState.UNSET]}
    </VStack>
  );
}
