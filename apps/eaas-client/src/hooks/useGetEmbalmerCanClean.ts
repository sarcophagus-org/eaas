import { ViewStateFacet__factory } from "@sarcophagus-org/sarcophagus-v2-contracts";
import { BigNumber } from "ethers";
import { SarcophagusData } from "@sarcophagus-org/sarcophagus-v2-sdk-client";
import { useContractRead } from "wagmi";
import { useGetGracePeriod } from "./useGetGracePeriod";
import { useNetworkConfig } from "ui/embalmer/NetworkConfigProvider";
import { useSelector } from "store";
import { UserType } from "types/userTypes";
import { ethers } from "ethers";

/**
 * Uses `embalmerClaimWindow` from the contracts to check if the signed in user can clean the
 * sarcophagus.
 */
export function useGetCanCleanSarcophagus(sarcophagus: SarcophagusData | undefined): boolean {
  const networkConfig = useNetworkConfig();
  const gracePeriod = useGetGracePeriod();
  // const { timestampMs } = useSelector(x => x.appState);
  const timestampMs = Date.now();

  const { data } = useContractRead({
    address: networkConfig.diamondDeployAddress as `0x${string}`,
    abi: ViewStateFacet__factory.abi,
    functionName: "getEmbalmerClaimWindow",
  });

  const user = useSelector((s) => s.userState.user);
  if (user?.type !== UserType.client) return false;
  if (!data) return false;
  if (!sarcophagus || !sarcophagus.hasLockedBond) return false;
  const address = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY!).address;
  if (sarcophagus.embalmerAddress !== address) return false;

  const sarcoResurrectionTime = Number.parseInt(sarcophagus.resurrectionTime.toString());
  const cleanWindow = Number.parseInt((data as BigNumber).toString());
  const nowSeconds = Math.trunc(timestampMs / 1000);

  const sarcoGracePeriod = sarcoResurrectionTime + gracePeriod;
  const isWithinCleanWindow =
    nowSeconds > sarcoGracePeriod && nowSeconds < sarcoGracePeriod + cleanWindow;

  return isWithinCleanWindow;
}
