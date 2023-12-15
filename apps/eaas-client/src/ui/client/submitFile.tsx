import React, { useRef, useState } from 'react';
import { Button, Input, Text, VStack, useToast } from '@chakra-ui/react';

import { useGenerateRecipientPDF } from "../../hooks/useGenerateRecipientPDF";
import { GeneratePDFState } from "../../store/embalm/actions";
import { useSelector } from "../../store";
import { useEffect } from "react";
import { sendPayload } from "../../api/embalm";
import { preparePayload } from "../../utils/preparePayload";
import {
  fileUploadFailure,
  fileUploadSuccess,
  redownloadPdfSuccess,
} from "utils/toast";
import { useNavigate } from "react-router-dom";
import { sarco } from "@sarcophagus-org/sarcophagus-v2-sdk-client";

export function SubmitFile() {
  const { downloadRecipientPDF } = useGenerateRecipientPDF();

  const user = useSelector((x) => x.userState.user);
  const { resurrection, file, recipientState } = useSelector((x) => x.embalmState);

  const toast = useToast();

  const [isUploading, setIsUploading] = React.useState(false);

  useEffect(() => {
    if (recipientState.generatePDFState === GeneratePDFState.GENERATED) {
      toast({
        title: "Downloaded PDF",
        status: "success",
      });

      downloadRecipientPDF(user!.email);
    }
  }, [downloadRecipientPDF, recipientState.generatePDFState, toast, user]);

  const navigate = useNavigate();

  const [payloadUploaded, setPayloadUploaded] = useState(false);
  const [sarcoCreated, setSarcoCreated] = useState(false);
  const [pdfPassword, setPdfPassword] = useState("");

  let sarcoCreatedPingCount = 0;

  let timer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (payloadUploaded) {
      timer.current = setInterval(() => {
        sarco.api
          .getSarcophagiByIds([recipientState.sarcoId])
          .then((sarcophagi) => {
            if (sarcophagi[0].name !== "not found") {
              setSarcoCreated(true);
              clearTimeout(timer.current);
            }
          })
          .catch(console.log)
          .finally(() => {
            if (sarcoCreatedPingCount < 10) {
              sarcoCreatedPingCount++;
              console.log("sarcoCreatedPingCount", sarcoCreatedPingCount);
            } else {
              clearTimeout(timer.current);
            }
          });
      }, 5000);
    }
  }, [payloadUploaded, recipientState.sarcoId, sarcoCreatedPingCount]);

  useEffect(() => {
    if (sarcoCreated) {
      navigate("/sarcophagi");
    }
  }, [navigate, sarcoCreated]);

  return (
    <VStack spacing={6} w="100%" align={"left"}>
        <Text>
          Your recipient file has been downloaded. You will need to send this securely to your
          recipient. Do not store this online or let anyone else see it!
        </Text>
        <Button
          alignSelf={"flex-start"}
          onClick={async () => {
            await downloadRecipientPDF(user!.email);
            toast(redownloadPdfSuccess());
          }}
        >
          Redownload PDF
        </Button>

        <Text>
          Enter a password that you will use in the future to securely redownload this pdf in case
          you lose it:
        </Text>
        <Input
          type="password"
          mb={10}
          onChange={(e) => setPdfPassword(e.target.value)}
          value={pdfPassword}
          resize="none"
        />

        <Button
          w="100%"
          maxW={"150px"}
          isLoading={isUploading}
          alignSelf={"center"}
          isDisabled={!pdfPassword}
          onClick={async () => {
            try {
              const preparedEncryptedPayload = await preparePayload({
                file: file!,
                recipientPublicKey: recipientState.publicKey,
              });

              setIsUploading(true);

              await sendPayload(
                {
                  resurrectionTime: resurrection,
                  preparedEncryptedPayload,
                  sarcoId: recipientState.sarcoId,
                },
                pdfPassword,
                Buffer.from(await recipientState.pdfBlob!.arrayBuffer()),
              );

              toast(fileUploadSuccess());
              setPayloadUploaded(true);

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              toast(fileUploadFailure(e));
              setIsUploading(false);
            }
          }}
        >
          Submit
        </Button>
      </VStack>
  
  );
};
