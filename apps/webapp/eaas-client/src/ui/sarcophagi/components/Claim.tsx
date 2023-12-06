import { Button, Center, Flex, Link, Spinner, Text, Textarea, useToast } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useRef, useState } from "react";
import { useGetSarcophagusDetails } from "hooks/useGetSarcophagusDetails";
import { useResurrection } from "hooks/useResurrection";
import { buildResurrectionDateString } from "utils/buildResurrectionDateString";
import { useParams } from "react-router-dom";

export function Claim() {
  const toast = useToast();
  const [privateKey, setPrivateKey] = useState("");

  const { id } = useParams();

  const [resurrectError, setResurrectError] = useState("");
  const [sarcophagusIdInput, setSarcophagusIdInput] = useState("");
  const [sarcophagusId, setSarcophagusId] = useState(id ?? "");

  const {
    sarcophagus,
    loadingSarcophagus,
    error: loadSarcophagusError,
  } = useGetSarcophagusDetails(sarcophagusId);

  // const { timestampMs } = useSelector(x => x.appState);
  const timestampMs = Date.now();

  const resurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime || BigNumber.from(0),
    timestampMs,
  );

  const { resurrect, isResurrecting, downloadProgress } = useResurrection(
    sarcophagusId || ethers.constants.HashZero,
    privateKey,
  );

  const privateKeyPad = (privKey: string): string => {
    return privKey.startsWith("0x") ? privKey : `0x${privKey}`;
  };

  const handleChangePrivateKey = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputString = e.target.value.replace(/\s+/g, "");
    const privateKeyValue = !inputString ? "" : privateKeyPad(inputString);
    setPrivateKey(privateKeyValue);
  };

  // linkRef is used to automatically trigger a download
  const linkRef = useRef<HTMLAnchorElement>(null);

  async function handleResurrect() {
    setResurrectError("");

    const { fileName, data, error } = await resurrect();
    if (error) {
      setResurrectError(error);
      return;
    }

    const dataUrl = data.toString();
    if (linkRef.current) {
      linkRef.current.href = dataUrl;
      linkRef.current.download = fileName;
      linkRef.current.click();
      toast({
        title: "Success",
        description: "Your payload has been downloaded",
        status: "success",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }

  // useEnterKeyCallback(handleResurrect);

  const canResurrect = !!sarcophagus && sarcophagus.publishedKeys.length >= sarcophagus.threshold;

  return !!sarcophagusId ? (
    <Flex direction="column" align="left">
      <Link ref={linkRef} />
      <Text>Resurrection Date</Text>
      <Text variant="secondary">{sarcophagus?.resurrectionTime ? resurrectionString : "--"}</Text>
      {!loadingSarcophagus ? (
        <>
          {canResurrect ? (
            <>
              <Text mt={12}>Sarcophagus Private Key</Text>
              <Textarea
                mt={2}
                w="100%"
                h="100px"
                value={privateKey}
                onChange={handleChangePrivateKey}
                placeholder="0x0000..."
              />
              {resurrectError ? (
                <Text mt={2} textColor="red">
                  {resurrectError}
                </Text>
              ) : downloadProgress ? (
                <Text mt={2}> {`Downloading... ${downloadProgress}%`} </Text>
              ) : (
                <Text mt={2}>Please enter the Private Key to decrypt the Sarcophagus</Text>
              )}

              <Button
                w="fit-content"
                disabled={!canResurrect || !privateKey || isResurrecting}
                mt={6}
                onClick={handleResurrect}
                isLoading={isResurrecting}
              >
                Decrypt and Download
              </Button>
            </>
          ) : loadSarcophagusError ? (
            <Flex mt={12}>
              {/* <SarcoAlert status="error">This Sarcophagus does not exist.</SarcoAlert> */}
              This Sarcophagus does not exist.
            </Flex>
          ) : (
            <Flex mt={12}>
              {/* <SarcoAlert status="warning">This Sarcophagus cannot be claimed yet.</SarcoAlert> */}
              This Sarcophagus cannot be claimed yet.
            </Flex>
          )}
        </>
      ) : (
        <Center mt={12}>
          <Spinner size="lg" />
        </Center>
      )}
    </Flex>
  ) : (
    <Flex mx={10} align="left" direction={"column"}>
      <Text mb={5}>Enter Sarcophagus ID</Text>
      <Textarea mb={10} onChange={(e) => setSarcophagusIdInput(e.target.value)} resize="none" />
      <Button onClick={() => setSarcophagusId(sarcophagusIdInput)}>Submit</Button>
    </Flex>
  );
}
