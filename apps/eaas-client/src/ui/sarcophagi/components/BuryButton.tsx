import { Button, Tooltip, useToast } from "@chakra-ui/react";
import { burySarco } from "api/sarcophagi";
import { useState } from "react";
import { buryFailed, burySuccess } from "utils/toast";

export function BuryButton({ id }: { id?: string }) {
  const [isBurying, setIsBurying] = useState(false);
  const [error, setError] = useState(false);

  const toast = useToast();

  async function handleBury() {
    setIsBurying(true);
    try {
      burySarco(id!);
      toast(burySuccess());
    } catch (err: any) {
      setError(true);
      toast(buryFailed(err));
    } finally {
      setIsBurying(false);
    }
  }

  return (
    <>
      {!error ? (
        <Tooltip placement="top" label="Deactivate this Sarcophagus so it can never be resurrected">
          <Button
            onClick={handleBury}
            isLoading={isBurying}
            loadingText={isBurying ? "Burying..." : undefined}
            disabled={!id || isBurying || !!error}
          >
            Bury
          </Button>
        </Tooltip>
      ) : (
        <></>
      )}
    </>
  );
}
