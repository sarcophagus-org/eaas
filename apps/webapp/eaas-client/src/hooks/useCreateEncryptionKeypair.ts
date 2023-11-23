import { useToast } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { useDispatch } from "../store";
import { generatedOuterKeys, generateOuterKeysFailure } from "../utils/toast";
import { setOuterLayerKeys } from "../store/embalm/actions";

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
  const [isLoading, setIsLoading] = useState(false);

  const createEncryptionKeypair = useCallback(async () => {
    try {
      setIsLoading(true);
      const { privateKey, publicKey } = await createEncryptionKeypairAsync();
      dispatch(setOuterLayerKeys(privateKey, publicKey));
      const id = "generateOuterKeys";
      if (!toast.isActive(id)) {
        toast(generatedOuterKeys(id));
      }
    } catch (_error) {
      const error = _error as Error;
      console.log(error);
      toast(generateOuterKeysFailure(error.message));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, toast]);

  return { isLoading, createEncryptionKeypair };
}