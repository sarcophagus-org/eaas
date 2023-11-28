import { Button, Tooltip } from "@chakra-ui/react";
import { burySarco } from "api/sarcophagi";
import { useState } from "react";

export function BuryButton({ id }: { id?: string }) {
  const [isBurying, setIsBurying] = useState(false);
  const [error, setError] = useState(false);

  async function handleBury() {
    setIsBurying(true);
    try {
      burySarco(id!);
      setIsBurying(false);
    } catch (err) {
      setIsBurying(false);
      setError(true);
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
