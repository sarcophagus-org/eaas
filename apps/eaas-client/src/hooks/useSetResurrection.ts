import { useRadioGroup } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../store";
import {
  setCustomResurrectionDate,
  setResurrection,
  setResurrectionRadioValue,
} from "../store/embalm/actions";

export const minimumResurrection = 30_000;

/**
 * Hook for managing resurrection selection
 */
export function useSetResurrection() {
  const dispatch = useDispatch();
  const {
    resurrection,
    resurrectionRadioValue: radioValue,
    customResurrectionDate,
  } = useSelector((x) => x.embalmState);

  // Although resurrection in ms is already stored in global state, we need another state to make it
  // easier to display the value in the DatePicker. Resurrection and CustomResurrectionDate will often be
  // managed in parallel.

  const [error, setError] = useState<string>();

  function handleRadioChange(nextValue: string) {
    dispatch(setResurrectionRadioValue(nextValue));
  }

  function handleCustomDateChange(date: Date | null) {
    dispatch(setCustomResurrectionDate(date));
  }

  function handleCustomDateClick() {
    dispatch(setResurrectionRadioValue("Other"));
  }

  // value and onChange are passed in to this hook instead of into a RadioGroup component.
  // This is part of creating a custom radio component
  const { getRadioProps } = useRadioGroup({
    value: radioValue,
    onChange: handleRadioChange,
  });

  // Update resurrection when the radio value changes
  useEffect(() => {
    if (radioValue !== "Other") {
      setCustomResurrectionDate(null);
      if (radioValue === "") {
        dispatch(setResurrection(0));
      } else {
        const [days] = radioValue === "" ? "0" : radioValue.split(" ");
        const intervalMs = parseInt(days) * 24 * 60 * 60 * 1000;
        dispatch(setResurrection(Date.now() + intervalMs));
      }
    } else {
      if (customResurrectionDate) {
        dispatch(setResurrection(customResurrectionDate.getTime()));
      }
    }
  }, [customResurrectionDate, dispatch, radioValue]);

  // Updates the error if the resurrection time is invalid
  useEffect(() => {
    if (resurrection - minimumResurrection < Date.now() && resurrection !== 0) {
      setError(
        `Resurrection must be ${moment
          .duration(minimumResurrection)
          .humanize()} or more in the future.`,
      );
    } else {
      setError(undefined);
    }
  }, [resurrection]);

  return {
    error,
    getRadioProps,
    radioValue,
    customResurrectionDate,
    resurrection,
    handleCustomDateChange,
    handleCustomDateClick,
  };
}
