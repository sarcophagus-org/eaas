import React, { useState } from "react";
import { inviteClient } from "../../api/invite";
import { Box, Button, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { UserType } from "../../types/userTypes";
import { useSelector } from "../../store";
import { clientInviteFailed, clientInvited } from "utils/toast";
import { EmbalmerSarcophagi } from "ui/sarcophagi/EmbalmerSarcophagi";

export const EmbalmerDashboard: React.FC = () => {
  const toast = useToast();
  const [clientEmail, setClientEmail] = useState<string>("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const appUser = useSelector((x) => x.userState.user);

  const handleInviteClient = async () => {
    try {
      setIsSendingInvite(true);
      await inviteClient(clientEmail);
      toast(clientInvited());
    } catch (err) {
      if (typeof err === "string") {
        toast(clientInviteFailed(err));
      }
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientEmail(event.target.value);
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      <VStack align={"left"} spacing={5} mb={10}>
        <Input placeholder="Client email" value={clientEmail} onChange={handleEmailChange} />
        <Button
          isLoading={isSendingInvite}
          isDisabled={!isEmailValid(clientEmail)}
          onClick={handleInviteClient}
        >
          Invite Client
        </Button>
      </VStack>
      <EmbalmerSarcophagi />
    </Box>
  );
};
