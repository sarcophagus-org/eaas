import { Button, Flex, HStack, Text, Tooltip } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { DetailsCollapse } from "./DetailsCollapse";
import { useGetSarcophagusDetails } from "../../../hooks/useGetSarcophagusDetails";
import { buildResurrectionDateString } from "../../../utils/buildResurrectionDateString";
import { useGetCanCleanSarcophagus } from "hooks/useGetEmbalmerCanClean";
import { rewrapTooltip } from "./SarcoTableRow";
import { SarcophagusState } from "@sarcophagus-org/sarcophagus-v2-sdk-client";
import { useSelector } from "store";
import { UserType } from "types/userTypes";
import { BuryButton } from "./BuryButton";
import { CleanButton } from "./CleanButton";

export function SarcophagusDetails() {
  const { id } = useParams();
  const timestampMs = Date.now();

  const { sarcophagus } = useGetSarcophagusDetails(id);

  const navigate = useNavigate();

  const resurrectionString = buildResurrectionDateString(
    BigNumber.from(sarcophagus?.resurrectionTime || 0),
    timestampMs,
  );

  const canClean = useGetCanCleanSarcophagus(sarcophagus);

  const user = useSelector((x) => x.userState.user);

  const canRewrapOrBury =
    sarcophagus?.state === SarcophagusState.Active && user?.type === UserType.client;

  return (
    <Flex pb={100} direction="column">
      {sarcophagus && <DetailsCollapse id={id} sarcophagus={sarcophagus} />}
      <Text mt={6}>Resurrection Date</Text>
      <Text variant="secondary">{sarcophagus?.resurrectionTime ? resurrectionString : "--"}</Text>

      <HStack pt={10}>
        {canRewrapOrBury && (
          <>
            {/* REWRAP BUTTON */}
            {
              <Tooltip placement="top" label={rewrapTooltip}>
                <Button as={NavLink} to="?action=rewrap">
                  Rewrap
                </Button>
              </Tooltip>
            }

            {/* BURY BUTTON */}
            {<BuryButton id={id} />}
          </>
        )}

        {/* CLEAN BUTTON */}
        {canClean && !!sarcophagus && <CleanButton sarco={sarcophagus} />}
      </HStack>

      <Button my={10} onClick={() => navigate(user?.type === UserType.embalmer ? "/" : "./..")}>
        Back
      </Button>
    </Flex>
  );
}
