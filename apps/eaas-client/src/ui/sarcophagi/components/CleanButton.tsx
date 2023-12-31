import { Button, Tooltip, useToast } from "@chakra-ui/react";
import { SarcophagusData } from "@sarcophagus-org/sarcophagus-v2-sdk-client";
import { cleanSarco } from "api/sarcophagi";
import { useGetCanCleanSarcophagus } from "hooks/useGetEmbalmerCanClean";
import { useState } from "react";
import { cleanFailure, cleanSuccess } from "utils/toast";

export const cleanTooltip =
  "Claim bonds and digging fees from Archaeologists that did not participate in the unwrapping ceremony";

export function CleanButton({ sarco }: { sarco: SarcophagusData }) {
  const [isCleaning, setIsCleaning] = useState(false);
  const [error, setError] = useState(false);

  const canEmbalmerClean = useGetCanCleanSarcophagus(sarco);
  const toast = useToast();

  async function handleClean() {
    setIsCleaning(true);
    try {
      cleanSarco(sarco.id);
      toast(cleanSuccess());
    } catch (err: any) {
      setError(true);
      toast(cleanFailure(err));
    } finally {
      setIsCleaning(false);
    }
  }

  return (
    <>
      {!error ? (
        <Tooltip placement="top" label={cleanTooltip}>
          <Button
            onClick={handleClean}
            isLoading={isCleaning}
            loadingText={isCleaning ? "Cleaning..." : undefined}
            disabled={isCleaning || error || canEmbalmerClean}
          >
            Clean
          </Button>
        </Tooltip>
      ) : (
        <></>
      )}
    </>
  );
}
