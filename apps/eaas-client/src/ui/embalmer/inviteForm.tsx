import React, { useState } from "react";
import { getInvites, inviteClient } from "../../api/invite";
import { Box, Button, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { clientInviteFailed, clientInvited } from "utils/toast";
import { setInvites } from "store/user/actions";
import { useDispatch } from "store";

export function InviteForm() {
  const toast = useToast();
  const [clientEmail, setClientEmail] = useState<string>("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const dispatch = useDispatch();

  const handleInviteClient = async () => {
    try {
      setIsSendingInvite(true);
      await inviteClient(clientEmail);
      toast(clientInvited());

      getInvites()
        .then((res) => dispatch(setInvites(res)))
        .catch((err) => console.log(err));
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

  return (
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
    </Box>
  );
}
