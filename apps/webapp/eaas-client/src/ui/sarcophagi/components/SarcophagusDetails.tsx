import { Flex, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useParams } from "react-router-dom";
import { DetailsCollapse } from "./DetailsCollapse";
import React from "react";
import { useGetSarcophagusDetails } from "../../../hooks/useGetSarcophagusDetails";
import { buildResurrectionDateString } from "../../../utils/buildResurrectionDateString";

export function SarcophagusDetails() {
  const { id } = useParams();
  const timestampMs = Date.now();

  const { sarcophagus } = useGetSarcophagusDetails(id);

  const resurrectionString = buildResurrectionDateString(
    BigNumber.from(sarcophagus?.resurrectionTime || 0),
    timestampMs,
  );

  return (
    <Flex pb={100} direction="column">
      {sarcophagus && <DetailsCollapse id={id} sarcophagus={sarcophagus} />}
      <Text mt={6}>Resurrection Date</Text>
      <Text variant="secondary">{sarcophagus?.resurrectionTime ? resurrectionString : "--"}</Text>
    </Flex>
  );
}
