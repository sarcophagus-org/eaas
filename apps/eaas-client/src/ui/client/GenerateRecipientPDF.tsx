import { VStack, Button, useToast, Box } from "@chakra-ui/react";
import { useGenerateRecipientPDF } from "../../hooks/useGenerateRecipientPDF";
import { GeneratePDFState } from "../../store/embalm/actions";
import { useSelector } from "../../store";
import { useEffect } from "react";
import { generatePDFFailure } from "utils/toast";
import EmbalmStepHeader from "ui/components/embalmStepHeader";
import { SubmitFile } from "./submitFile";

export function GenerateRecipientPDF() {
  const { generatePublicKey, downloadRecipientPDF, isLoading, generateError } =
    useGenerateRecipientPDF();

  const user = useSelector((x) => x.userState.user);
  const { resurrection, file, recipientState } = useSelector((x) => x.embalmState);

  const toast = useToast();

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
        title: "Downloaded PDF",
        status: "success",
      });

      downloadRecipientPDF(user!.email);
    }
  }, [downloadRecipientPDF, recipientState.generatePDFState, toast, user]);

  const generateStateMap: Record<GeneratePDFState, any> = {
    [GeneratePDFState.UNSET]: (
      <VStack align="left" spacing={4}>
        <Button width="fit-content" onClick={handleGeneratePDFClick} isLoading={isLoading}>
          Generate Recipient PDF
        </Button>
      </VStack>
    ),
    [GeneratePDFState.DOWNLOADED]: <SubmitFile />,
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
