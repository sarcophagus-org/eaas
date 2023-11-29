import { useToast } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "../../store";
import { formatToastMessage } from "../../utils/toastUtils";
import { setOuterLayerKeys } from "../../store/embalm/actions";

import { ethers } from "ethers";

export async function createEncryptionKeypairAsync(): Promise<{
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

export function useCreateEncryptionKeypair() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { outerPrivateKey, outerPublicKey } = useSelector((x) => x.embalmState);
  const [isLoading, setIsLoading] = useState(false);

  const createEncryptionKeypair = useCallback(async () => {
    try {
      setIsLoading(true);
      const { privateKey, publicKey } = await createEncryptionKeypairAsync();
      dispatch(setOuterLayerKeys(privateKey, publicKey));
      const id = "generateOuterKeys";
      if (!toast.isActive(id)) {
        toast({
          ...{
            title: "Keys generated",
            description: "A new pair of encryption keys have been generated.",
            status: "success",
          },
          id,
        });
      }
    } catch (_error) {
      const error = _error as Error;
      toast({
        title: "Failed to generate keys",
        description: formatToastMessage(error.message),
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, toast]);

  // Generates the key pair when the user opens the create encryption pair step
  // This effect will likely trigger twice, which is fine
  useEffect(() => {
    (async () => {
      if (!outerPrivateKey && !outerPublicKey) {
        await createEncryptionKeypair();
      }
    })();
  }, [createEncryptionKeypair, dispatch, outerPrivateKey, outerPublicKey, toast]);

  return { outerPrivateKey, outerPublicKey, isLoading, createEncryptionKeypair };
}
