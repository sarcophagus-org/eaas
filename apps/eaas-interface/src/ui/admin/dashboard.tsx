import React, { useState, useEffect } from "react";
import { getUserList } from "../../api/user";
import { inviteClient } from "../../api/invite";
import { Box, Button, Heading, Input, List, ListItem, Text } from "@chakra-ui/react";

import { EaasUser } from "../../types/userTypes";
import { adminUser } from "../../store/tempMemoryStore";

export const AdminDashboard: React.FC = () => {
  const [userList, setUserList] = useState<EaasUser[]>([]);

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
    alert("Client invited!");
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientEmail(event.target.value);
  };

  return (
    <Box>
      <Heading>Admin Dashboard</Heading>
      <Text>Admin email: {adminUser?.email}</Text>
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
