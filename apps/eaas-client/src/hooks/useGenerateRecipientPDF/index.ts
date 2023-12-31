import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import sanitize from "sanitize-filename";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "../../store";
import { GeneratePDFState, RecipientState, setRecipientState } from "../../store/embalm/actions";
import { createRecipientKeyDocument } from "../useGenerateRecipientPDF/recipientKeyDocument";
import { sarco } from "@sarcophagus-org/sarcophagus-v2-sdk-client";

async function createEncryptionKeypair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  return new Promise((resolve) => {
    const wallet = ethers.Wallet.createRandom();
    const publicKey = wallet.publicKey;
    const privateKey = wallet.privateKey;
    resolve({ privateKey, publicKey });
  });
}

export function useGenerateRecipientPDF() {
  const dispatch = useDispatch();
  const { recipientState } = useSelector((x) => x.embalmState);
  const { user } = useSelector((x) => x.userState);
  const [isLoading, setIsLoading] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const generatePublicKey = useCallback(async () => {
    try {
      setIsLoading(true);
      setGenerateError(null);

      const { privateKey, publicKey } = await createEncryptionKeypair();

      const sarcoId = sarco.utils.generateSarchophagusId(`${publicKey}-${Date.now()}`);

      const recipient: RecipientState = {
        address: ethers.utils.computeAddress(publicKey),
        publicKey,
        privateKey,
        generatePDFState: GeneratePDFState.GENERATED,
        sarcoId,
      };

      dispatch(setRecipientState(recipient));
      setIsLoading(false);
    } catch (_error) {
      dispatch(
        setRecipientState({
          address: "",
          publicKey: "",
          privateKey: "",
          sarcoId: "",
          generatePDFState: GeneratePDFState.UNSET,
        }),
      );
      const error = _error as Error;
      setGenerateError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const downloadRecipientPDF = useCallback(
    async (sender: string) => {
      try {
        setIsLoading(true);
        setGenerateError(null);

        const recipientKeyDocument = await createRecipientKeyDocument(user!.email, recipientState);
        const pdfBlob = await pdf(recipientKeyDocument).toBlob();
        saveAs(pdfBlob, sanitize(sender + "-" + recipientState.address.slice(0, 6) + ".pdf"));

        const newRecipientState: RecipientState = {
          address: recipientState.address,
          publicKey: recipientState.publicKey,
          privateKey: recipientState.privateKey,
          sarcoId: recipientState.sarcoId,
          generatePDFState: GeneratePDFState.DOWNLOADED,
          pdfBlob,
        };

        dispatch(setRecipientState(newRecipientState));
        return recipientKeyDocument;
      } catch (_error) {
        dispatch(
          setRecipientState({
            address: "",
            publicKey: "",
            sarcoId: "",
          }),
        );
        const error = _error as Error;
        setGenerateError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, recipientState, user],
  );

  return { isLoading, downloadRecipientPDF, generatePublicKey, generateError };
}
