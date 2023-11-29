import { Button, Flex, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useNavigate, useParams } from "react-router-dom";
import { DetailsCollapse } from "./DetailsCollapse";
import { useGetSarcophagusDetails } from "../../../hooks/useGetSarcophagusDetails";
import { buildResurrectionDateString } from "../../../utils/buildResurrectionDateString";

export function SarcophagusDetails() {
  const { id } = useParams();
  const timestampMs = Date.now();

  const { sarcophagus } = useGetSarcophagusDetails(id);

  const navigate = useNavigate();

  const resurrectionString = buildResurrectionDateString(
    BigNumber.from(sarcophagus?.resurrectionTime || 0),
    timestampMs,
  );

  return (
    <Flex pb={100} direction="column">
      {sarcophagus && <DetailsCollapse id={id} sarcophagus={sarcophagus} />}
      <Text mt={6}>Resurrection Date</Text>
      <Text variant="secondary">{sarcophagus?.resurrectionTime ? resurrectionString : "--"}</Text>
      <Button my={10} onClick={() => navigate("./..") }>Back</Button>
    </Flex>
  );
}
