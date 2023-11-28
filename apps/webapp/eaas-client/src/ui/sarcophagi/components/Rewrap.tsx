import {
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DatePicker } from "../../components/DatePicker";
import { DatePickerButton } from "../../components/DatePicker/DatePickerButton";
import { useGetSarcophagusDetails } from "hooks/useGetSarcophagusDetails";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buildResurrectionDateString } from "utils/buildResurrectionDateString";
import { BigNumber } from "ethers";
import { rewrapSarco } from "api/sarcophagi";
import { rewrapFailed, rewrapSuccess } from "utils/toast";

export function Rewrap() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { sarcophagus } = useGetSarcophagusDetails(id);
  const [resurrectionTime, setResurrectionTime] = useState<Date | null>(null);
  const [isRewrapping, setIsRewrapping] = useState(false);

  // const { timestampMs } = useSelector(x => x.appState);
  const timestampMs = Date.now();

  const maxRewrapIntervalFromSarcophagusSec = sarcophagus?.maximumRewrapInterval?.toNumber() ?? 0;

  // The calculated max rewrap interval is
  // ( new resurrection time - previous resurrection time ) * (2_000_000 / cursed bond percentage)
  // Defaults to max possible number
  const maxRewrapIntervalCalculatedSec = sarcophagus
    ? (Number(sarcophagus.resurrectionTime) - Number(sarcophagus.previousRewrapTime)) *
      (2_000_000 / sarcophagus.cursedBondPercentage)
    : Number.MAX_SAFE_INTEGER;

  // The max rewrap interval is the lesser value of the max rewrap interval from the sarcophagus and
  // the calculated max rewrap interval
  const maxRewrapIntervalMs =
    (maxRewrapIntervalFromSarcophagusSec < maxRewrapIntervalCalculatedSec
      ? maxRewrapIntervalFromSarcophagusSec
      : maxRewrapIntervalCalculatedSec) * 1000;

  function handleCustomDateChange(date: Date | null): void {
    // Ensure that selected date is in the future
    if (date && date.getTime() > timestampMs) {
      setResurrectionTime(date);
    }
  }

  const maxResurrectionDate = new Date(timestampMs + Number(maxRewrapIntervalMs));
  const maxResurrectionDateMs = maxResurrectionDate.getTime();

  function handleSetToPreviousInterval() {
    if (sarcophagus) {
      const newResurrectionTimeSec = sarcophagus.resurrectionTime
        .mul(2)
        .sub(sarcophagus.previousRewrapTime);

      if (newResurrectionTimeSec.mul(1000).toNumber() > maxResurrectionDateMs) {
        setResurrectionTime(new Date(maxResurrectionDateMs));
      } else {
        setResurrectionTime(new Date(newResurrectionTimeSec.mul(1000).toNumber()));
      }
    }
  }

  const filterInvalidTime = (time: Date) => {
    const selectedDateMs = new Date(time).getTime();
    return maxResurrectionDateMs >= selectedDateMs && timestampMs < selectedDateMs;
  };

  const maxResurrectionString = buildResurrectionDateString(
    BigNumber.from(Math.trunc(maxResurrectionDateMs / 1000)),
    timestampMs,
  );

  const currentResurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime,
    timestampMs,
    {
      hideDuration: true,
    },
  );

  const isRewrapButtonDisabled = !resurrectionTime || isRewrapping;

  const toast = useToast();

  return (
    <VStack align="left" spacing={10} pointerEvents={isRewrapping ? "none" : "all"}>
      <VStack align="left" spacing={0}>
        <Text>Rewrap</Text>
        <Text variant="secondary">
          Please set a new time when you want your Sarcophagus resurrected.
        </Text>
      </VStack>

      <Flex
        direction="column"
        border="1px solid "
        borderColor="grayBlue.700"
        p={6}
        align="left"
        maxW="600px"
      >
        <Grid h="100px" templateRows="repeat(3, 1fr)" templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem alignSelf="end" justifySelf="center">
            <Text variant="secondary">New Resurrection</Text>
          </GridItem>
          <GridItem alignSelf="end" justifySelf="center">
            <Text variant="secondary">Current Resurrection</Text>
          </GridItem>
          <GridItem alignSelf="center" justifySelf="center">
            <DatePicker
              selected={resurrectionTime}
              onChange={handleCustomDateChange}
              showTimeSelect
              minDate={new Date(timestampMs)}
              maxDate={maxResurrectionDate}
              filterTime={filterInvalidTime}
              showPopperArrow={false}
              timeIntervals={30}
              timeCaption="Time"
              timeFormat="hh:mma"
              dateFormat="MM.dd.yyyy hh:mma"
              fixedHeight
              customInput={<DatePickerButton />}
            />
          </GridItem>
          <GridItem alignSelf="center" justifySelf="center">
            <Text fontSize="md">{currentResurrectionString}</Text>
          </GridItem>
          <GridItem alignSelf="center" justifySelf="center">
            <GridItem></GridItem>
            <Button size="sm" variant="outline" onClick={handleSetToPreviousInterval}>
              <Text fontSize="xs" variant="secondary">
                Use Previous Interval
              </Text>
            </Button>
          </GridItem>
        </Grid>
        <Text mt="64px" variant="secondary" textAlign="center">
          Furthest allowed rewrap time: {maxResurrectionString}
        </Text>
      </Flex>

      <VStack align="left" spacing={1}>
        <Flex direction="row">
          <Text>Fees</Text>
          <Text ml={1} variant="secondary">
            (estimated)
          </Text>
        </Flex>
      </VStack>
      <HStack>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Tooltip label={!resurrectionTime ? "Please set a new resurrection time" : ""}>
          <div>
            <Button
              onClick={() => {
                setIsRewrapping(true);
                rewrapSarco(id!, resurrectionTime!.getDate())
                  .then(() => {
                    toast(rewrapSuccess());
                    setIsRewrapping(false);
                  })
                  .catch((error) => toast(rewrapFailed(error)));
              }}
              isDisabled={!id || !resurrectionTime || isRewrapButtonDisabled}
              isLoading={isRewrapping}
              loadingText={"Rewrapping..."}
            >
              Rewrap
            </Button>
          </div>
        </Tooltip>
      </HStack>
    </VStack>
  );
}
