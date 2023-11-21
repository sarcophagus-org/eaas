import { BigNumber, ethers } from "ethers";
import moment from "moment";

/**
 * Builds a resurrection date string from a BigNumber
 * Ex: 09.22.2022 7:30pm (12 Days)
 * @param resurrectionTime
 * @returns The resurrection string
 */
export function buildResurrectionDateString(
  resurrectionTime: BigNumber | undefined,
  timestampMs: number,
  options?: { format?: string; hideDuration?: boolean },
): string {
  const { format = "MM.DD.YYYY h:mmA", hideDuration = false } = options || {};

  // In the case where sarcophagus resurrection time is not defined for whatever reason
  if (!resurrectionTime) {
    return "--";
  }

  // In the case where the sarcophagus is buried, the resurrection time will be set to the max
  // uint256 value. It's not possible to display this number as a date.
  if (resurrectionTime.toString() === ethers.constants.MaxUint256.toString()) {
    return "--";
  }

  const resurrectionDateString = moment.unix(resurrectionTime.toNumber()).format(format);
  const msUntilResurrection = resurrectionTime.toNumber() * 1000 - timestampMs;
  const humanizedDuration = moment.duration(msUntilResurrection).humanize();
  const timeUntilResurrection =
    msUntilResurrection < 0 ? `${humanizedDuration} ago` : humanizedDuration;
  return hideDuration
    ? resurrectionDateString
    : `${resurrectionDateString} (${timeUntilResurrection})`;
}
