import { EditIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  TableRowProps,
  Td,
  Text,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SarcoStateIndicator } from "./SarcoStateIndicator";
import { SarcophagusState } from "@sarcophagus-org/sarcophagus-v2-sdk-client";
import { useGetCanCleanSarcophagus } from "../../../hooks/useGetEmbalmerCanClean";
import { buildResurrectionDateString } from "../../../utils/buildResurrectionDateString";
import { TableText } from "./TableText";
import { SarcoAction } from ".";
import { useSelector } from "store";
import { UserType } from "types/userTypes";
import { cleanSarco } from "api/sarcophagi";
import { cleanFailure, cleanSuccess } from "utils/toast";
import { SarcophagusDataWithClientEmail } from "types/sarcophagi";

export interface SarcophagusTableRowProps extends TableRowProps {
  sarco: SarcophagusDataWithClientEmail;
  dateCalculationInterval?: number;
}

export const rewrapTooltip = "Set a new resurrection date for the Sarcophagus";

/**
 * Custom TableRow component to be used in place of the default Tr component. Adds a sort icon.
 */
export function SarcoTableRow({
  sarco,
  dateCalculationInterval = 60_000,
}: SarcophagusTableRowProps) {
  // const { timestampMs } = useSelector(x => x.appState);
  const timestampMs = Date.now();

  const user = useSelector((x) => x.userState.user);

  const [resurrectionString, setResurrectionString] = useState("");

  const [isCleaning, setIsCleaning] = useState(false);

  const toast = useToast();

  async function handleClean() {
    setIsCleaning(true);
    try {
      cleanSarco(sarco.id);
      toast(cleanSuccess());
    } catch (err: any) {
      console.log(err);
      toast(cleanFailure(err));
    } finally {
      setIsCleaning(false);
    }
  }

  // Payment for clean automatically goes to the current user
  const canEmbalmerClean = useGetCanCleanSarcophagus(sarco);

  const cleanTooltip = canEmbalmerClean
    ? "Claim bonds and digging fees from Archaeologists that did not participate in the unwrapping ceremony"
    : "";
  const cleanAction = canEmbalmerClean ? SarcoAction.Clean : undefined;

  const stateToActionMap: {
    [key: string]: {
      action?: SarcoAction;
      tooltip?: string;
    };
  } = {
    [SarcophagusState.Active]: {
      action: user?.type === UserType.client ? SarcoAction.Rewrap : undefined,
      tooltip: user?.type === UserType.client ? rewrapTooltip : "",
    },
    [SarcophagusState.Resurrected]: {
      // The embalmer isn't concerned with claiming a sarco. BUT, if they can clean a resurrected sarco,
      // that's something they care about.
      action: cleanAction,
      tooltip: cleanTooltip,
    },
    [SarcophagusState.Failed]: {
      action: cleanAction,
      tooltip: cleanTooltip,
    },
  };

  const action = stateToActionMap[sarco.state]?.action;
  const actionTooltip = stateToActionMap[sarco.state]?.tooltip;

  const navigate = useNavigate();

  function handleClickAction() {
    switch (action) {
      case SarcoAction.Clean:
        handleClean();
        break;
      case SarcoAction.Rewrap:
        navigate(`/sarcophagi/${sarco.id}?action=rewrap`);
        break;
      default:
        break;
    }
  }

  // Updates the resurrection date string on an interval
  useEffect(() => {
    setResurrectionString(
      buildResurrectionDateString(
        BigNumber.from(sarco.resurrectionTime) || BigNumber.from(0),
        timestampMs,
      ),
    );

    const intervalId = setInterval(() => {
      setResurrectionString(
        buildResurrectionDateString(
          BigNumber.from(sarco.resurrectionTime) || BigNumber.from(0),
          timestampMs,
        ),
      );
    }, dateCalculationInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [dateCalculationInterval, sarco, sarco.resurrectionTime, timestampMs]);

  return (
    <Tr>
      {/* SARCO STATE */}
      <Td>
        <HStack>
          <SarcoStateIndicator state={sarco.state} />

          {/* Using `canEmbalmerClean` to draw attention to this row */}
          {canEmbalmerClean && (
            <Tooltip
              placement="right-start"
              label="You can clean this sarcophagus to claim back funds"
            >
              <InfoOutlineIcon color="orange" />
            </Tooltip>
          )}
        </HStack>
      </Td>

      {/* SARCO NAME */}
      <Td>
        <TableText>{sarco.name?.toUpperCase()}</TableText>
      </Td>

      {/* SARCO RESURRECTION */}
      <Td>
        <TableText>{resurrectionString}</TableText>
      </Td>

      {/* CLIENT EMAIL */}
      {user?.type === UserType.embalmer ? (
        <Td textAlign="center">
          <TableText>{sarco.clientEmail ?? "--"}</TableText>
        </Td>
      ) : null}

      {/* QUICK ACTION */}
      <Td textAlign="center">
        {action ? (
          <Tooltip
            isDisabled={!actionTooltip}
            openDelay={500}
            label={actionTooltip}
            placement="right-start"
          >
            <Button variant="link" onClick={handleClickAction} isLoading={isCleaning}>
              {action.toUpperCase()}
            </Button>
          </Tooltip>
        ) : (
          <Text>--</Text>
        )}
      </Td>

      {/* SARCO DETAILS LINK */}
      <Td textAlign="center">
        <IconButton
          as={NavLink}
          to={`/sarcophagi/${sarco.id}`}
          aria-label="Details"
          variant="unstyled"
          icon={<EditIcon />}
        />
      </Td>
    </Tr>
  );
}
