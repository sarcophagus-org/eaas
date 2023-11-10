import React, { useState, useEffect } from "react";
import { getUserList } from "../../api/user";
import { inviteClient } from "../../api/invite";
import { Box, Button, Heading, Input, List, ListItem, Text, useToast } from "@chakra-ui/react";

import { EaasUser } from "../../types/userTypes";
import { appUser } from "../../store/tempMemoryStore";

export const AdminDashboard: React.FC = () => {
  const [userList, setUserList] = useState<EaasUser[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const userListResponse = await getUserList();
      if (userListResponse) setUserList(userListResponse);
    };

    fetchUserData();
  }, []);

  const [clientEmail, setClientEmail] = useState<string>("");

  const handleInviteClient = async () => {
    await inviteClient(clientEmail);
    toast({
      title: "Client invited!",
      status: "success",
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientEmail(event.target.value);
  };

  return !appUser?.is_admin ? (
    <Box>
      <Text>You are not authorized to view this page.</Text>
    </Box>
  ) : (
    <Box>
      <Heading>Admin Dashboard</Heading>
      <Text>Admin email: {appUser?.email}</Text>
      <Heading size={"sm"}>User List</Heading>
      <List>
        {userList.map((user) => (
          <ListItem key={user.id}>
            {"->"} {user.name} ({user.email})
          </ListItem>
        ))}
      </List>
      <Box>
        <Input placeholder="Client email" value={clientEmail} onChange={handleEmailChange} />
        <Button onClick={handleInviteClient}>Invite Client</Button>
      </Box>
    </Box>
  );
};
