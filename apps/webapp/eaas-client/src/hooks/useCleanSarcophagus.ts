import { useToast } from "@chakra-ui/react";
import { ThirdPartyFacet__factory } from "@sarcophagus-org/sarcophagus-v2-contracts";
// import { useNetworkConfig } from 'lib/config';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

export function useCleanSarcophagus(sarcoId: string, canEmbalmerClean: boolean) {
  // const networkConfig = useNetworkConfig();
  const toast = useToast();

  const { config, isError: mayFail } = usePrepareContractWrite({
    // address: networkConfig.diamondDeployAddress as `0x${string}`,
    abi: ThirdPartyFacet__factory.abi,
    enabled: canEmbalmerClean,
    functionName: "clean",
    args: [sarcoId],
  });

  const { write, isError, data } = useContractWrite({
    onError: () =>
      toast({
        title: "Error cleaning sarcophagus",
        description: "The sarcophagus could not be cleaned. Please try again.",
        status: "error",
        isClosable: true,
      }),
    ...config,
  });

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () =>
      toast({
        title: "Sarcophagus cleaned",
        description: "The sarcophagus has been cleaned.",
        status: "success",
        isClosable: true,
      }),
    onError(e) {
      console.error(e);
      toast({
        title: "Error cleaning sarcophagus",
        description: "The sarcophagus could not be cleaned. Please try again.",
        status: "error",
        isClosable: true,
      });
    },
  });

  return {
    clean: write,
    isCleaning: isLoading,
    isSuccess,
    isError,
    mayFail,
  };
}
