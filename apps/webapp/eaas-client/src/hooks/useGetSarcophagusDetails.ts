import { useEffect, useState } from "react";
import { SarcophagusDetails, sarco } from "@sarcophagus-org/sarcophagus-v2-sdk-client";
import { useSupportedNetwork } from "ui/embalmer/NetworkConfigProvider";

export function useGetSarcophagusDetails(sarcoId: string | undefined) {
  const [sarcophagus, setSarcophagus] = useState<SarcophagusDetails>();
  const [loadingSarcophagus, setLoadingSarcophagus] = useState(false);
  const { isSarcoInitialized } = useSupportedNetwork();

  useEffect(() => {
    if (!sarcoId || !isSarcoInitialized) return;

    setLoadingSarcophagus(true);
    
    sarco.api.getSarcophagusDetails(sarcoId || "").then((res) => {
      setSarcophagus(res);
      setLoadingSarcophagus(false);
    });
  }, [sarcoId, isSarcoInitialized]);

  return { sarcophagus, loadingSarcophagus };
}
