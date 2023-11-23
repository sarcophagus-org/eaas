import React, { useState } from "react";
import { inviteClient } from "../../api/invite";
import { Box, Button, HStack, Heading, Input, Text, useToast } from "@chakra-ui/react";
import { UserType } from "../../types/userTypes";
import { useSelector } from "../../store";
import { LogoutButton } from "../login";

export const EmbalmerDashboard: React.FC = () => {
  const toast = useToast();
  const [clientEmail, setClientEmail] = useState<string>("");
  const appUser = useSelector((x) => x.userState.user);

  const handleInviteClient = async () => {
    try {
      await inviteClient(clientEmail);
      toast({
        title: "Client invited!",
        status: "success",
      });
    } catch (err) {
      toast({
        title: `Error inviting client: ${err}`,
        status: "error",
      });
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
      <HStack>
        <Heading>Embalmer Dashboard</Heading>
        <LogoutButton />
      </HStack>
      <Text>Embalmer email: {appUser?.email}</Text>
      <Box>
        <Input placeholder="Client email" value={clientEmail} onChange={handleEmailChange} />
        <Button onClick={handleInviteClient}>Invite Client</Button>
      </Box>
    </Box>
  );
};