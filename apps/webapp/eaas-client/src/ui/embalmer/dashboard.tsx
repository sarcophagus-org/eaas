import React, { useState } from "react";
import { inviteClient } from "../../api/invite";
import { Box, Button, Input, Text, useToast } from "@chakra-ui/react";
import { UserType } from "../../types/userTypes";
import { useSelector } from "../../store";
import { clientInviteFailed, clientInvited } from "utils/toast";
import { EmbalmerSarcophagi } from "ui/sarcophagi/EmbalmerSarcophagi";

export const EmbalmerDashboard: React.FC = () => {
  const toast = useToast();
  const [clientEmail, setClientEmail] = useState<string>("");
  const appUser = useSelector((x) => x.userState.user);

  const handleInviteClient = async () => {
    try {
      await inviteClient(clientEmail);
      toast(clientInvited());
    } catch (err) {
      if (typeof err === "string") {
        toast(clientInviteFailed(err));
      }
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientEmail(event.target.value);
  };

  return appUser?.type === UserType.client ? (
    <Box>
      <Text>You are not authorized to view this page.</Text>
    </Box>
  ) : (
    <Box>
      <Text fontWeight="bold" mb={5}>
        Invite a Client
      </Text>
      <Box mb={10}>
        <Input placeholder="Client email" value={clientEmail} onChange={handleEmailChange} />
        <Button onClick={handleInviteClient}>Invite Client</Button>
      </Box>
      <EmbalmerSarcophagi />
    </Box>
  );
};
