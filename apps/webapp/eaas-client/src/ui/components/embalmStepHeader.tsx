import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

type EmbalmStepHeaderProps = {
  headerText: string;
  subText: string;
};

const EmbalmStepHeader: React.FC<EmbalmStepHeaderProps> = ({ headerText, subText }) => {
  return (
    <Box>
      <Heading as="h3">{headerText}</Heading>
      <Text>{subText}</Text>
    </Box>
  );
};

export default EmbalmStepHeader;
