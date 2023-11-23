import { Flex, FlexProps, HStack, Radio, Text, VStack } from "@chakra-ui/react";
import { useSetResurrection } from "../../hooks/useSetResurrection";
import { DatePicker } from "../components/DatePicker";
import { DatePickerButton } from "../components/DatePicker/DatePickerButton";

enum ResurrectionRadioValue {
  ThirtyDays = "30 days",
  SixtyDays = "60 days",
  NinetyDays = "90 days",
}

export function SetResurrection({ ...rest }: FlexProps) {
  const options = Object.values(ResurrectionRadioValue);

  const {
    error,
    getRadioProps,
    radioValue,
    customResurrectionDate,
    resurrection,
    handleCustomDateChange,
    handleCustomDateClick,
  } = useSetResurrection();

  const timestampMs = Date.now();

  const selectedResurrectionTime =
    customResurrectionDate ?? !!resurrection ? new Date(resurrection) : undefined;

  const resDateStringParts = selectedResurrectionTime?.toISOString().split("T") ?? [];
  const resurrectionDate = resDateStringParts.at(0) ?? "";
  const resurrectionTime =
    resDateStringParts.at(1)?.slice(0, resDateStringParts.at(1)?.lastIndexOf(":")) ?? "";

  return (
    <Flex direction="column" {...rest}>
      <VStack align="left" spacing="5" border="1px solid " borderColor="grayBlue.700" px={9} py={6}>
        <HStack spacing={6}>
          <Radio {...getRadioProps({ value: options[0] })}>
            <Text textAlign="center">{options[0]}</Text>
          </Radio>
          <Radio {...getRadioProps({ value: options[1] })}>
            <Text textAlign="center">{options[1]}</Text>
          </Radio>
          <Radio {...getRadioProps({ value: options[2] })}>
            <Text textAlign="center">{options[2]}</Text>
          </Radio>
        </HStack>
        <HStack spacing={6}>
          <Radio {...getRadioProps({ value: "Other" })}>
            <DatePicker
              selected={customResurrectionDate}
              onChange={handleCustomDateChange}
              onInputClick={handleCustomDateClick}
              showTimeSelect
              minDate={new Date(timestampMs)}
              showPopperArrow={false}
              timeIntervals={30}
              timeCaption="Time"
              timeFormat="hh:mma"
              dateFormat="MM.dd.yyyy hh:mma"
              fixedHeight
              filterTime={(date) => timestampMs < date.getTime()}
              customInput={
                <DatePickerButton variant={radioValue !== "Other" ? "disabledLook" : "solid"} />
              }
            />
          </Radio>
        </HStack>

        <Text>{`Resurrection: ${resurrectionDate} ${
          resurrectionTime && "at "
        }${resurrectionTime}`}</Text>
      </VStack>
      {error && (
        <Text mt={3} textAlign="center" color="error">
          {error}
        </Text>
      )}
    </Flex>
  );
}
