import React, { useState } from "react";
import { login } from "../api/user";
import { useNavigate } from "react-router-dom";
import { FormControl, FormLabel, Input, Button, VStack } from "@chakra-ui/react";
import { setUser, setTokens } from "../store/tempMemoryStore";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const response = await login({ email, password });
    if (response?.user) {
      // TOOO: extract response into global store
      setTokens(response.tokens);
      setUser(response.user);

      navigate("/dashboard/admin", { replace: true });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl id="email">
        <FormLabel>Email address</FormLabel>
        <Input type="email" value={email} onChange={handleUsernameChange} />
      </FormControl>

      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={handlePasswordChange} />
      </FormControl>

      <Button colorScheme="blue" type="submit" onClick={handleSubmit}>
        Login
      </Button>
    </VStack>
  );
};
