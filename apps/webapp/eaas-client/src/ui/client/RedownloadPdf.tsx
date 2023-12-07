import { Button, Flex, Input, Link, Text, useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { downloadRecipientPdf } from "api/sarcophagi";
import { redownloadPdfError, redownloadPdfSuccess } from "utils/toast";
import { useQuery } from "hooks/useQuery";

export function RedownloadPdfPage() {
  const [pdfPassword, setPdfPassword] = useState("");

  const sarcoId = useQuery().get("id");

  if (!sarcoId) {
    throw new Error("No sarco id provided");
  }

  const [isdownloading, setIsdownloading] = useState(false);
  const [redownloadError, setError] = useState(false);

  const toast = useToast();

  async function handleRedownloadPdf() {
    setIsdownloading(true);
    try {
      await downloadRecipientPdf(sarcoId!, pdfPassword);
      toast(redownloadPdfSuccess());
    } catch (err: any) {
      setError(true);
      toast(redownloadPdfError(err));
    } finally {
      setIsdownloading(false);
    }
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputString = e.target.value;
    setPdfPassword(inputString);
  };

  // linkRef is used to automatically trigger a download
  const linkRef = useRef<HTMLAnchorElement>(null);

  // useEnterKeyCallback(handleResurrect);

  return (
    <Flex direction="column" align="left">
      <Link ref={linkRef} />
      {redownloadError ? (
        <Text mt={2} textColor="red">
          {redownloadError}
        </Text>
      ) : (
        <Text mt={2}>Enter the password you used for this pdf to redownload it:</Text>
      )}

      <Input type="password" mt={2} w="40%" value={pdfPassword} onChange={handleChangePassword} />

      <Button
        w="fit-content"
        disabled={!pdfPassword}
        mt={6}
        onClick={handleRedownloadPdf}
        isLoading={isdownloading}
      >
        Submit
      </Button>
    </Flex>
  );
}
