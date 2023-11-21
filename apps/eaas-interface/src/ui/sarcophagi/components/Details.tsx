import { Flex, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useParams } from "react-router-dom";
import { DetailsCollapse } from "./DetailsCollapse";
import React from "react";
import { useGetSarcophagusDetails } from "../../../hooks/useGetSarcophagusDetails";
import { buildResurrectionDateString } from "../../../utils/buildResurrectionDateString";

export const resurrectTooltip = "Extend the resurrection date of the Sarcophagus";

export function Details() {
  const { id } = useParams();
  const timestampMs = Date.now();

  const { sarcophagus } = useGetSarcophagusDetails(id);

  const resurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime || BigNumber.from(0),
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
