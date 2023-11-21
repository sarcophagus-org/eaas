import { Icon } from "@chakra-ui/react";
import React from "react";

// SVG token from master figma file
// Primarily used for the sorting icon on tables
export function DownIcon(props) {
  return (
    <Icon viewBox="0 0 7 11" width="7" height="11" {...props}>
      <path d="M3.12494 10.4999L0 6.75H6.24988L3.12494 10.4999Z" fill="white" />
    </Icon>
  );
}
