import React, { useState } from "react";
import { login } from "../api/user";
import { useNavigate } from "react-router-dom";
import { FormControl, FormLabel, Input, Button, VStack, useToast } from "@chakra-ui/react";
import { useDispatch } from "../store";
import { clearTokens, setTokens, setUser } from "../store/user/actions";

export const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearTokens());
    dispatch(setUser(null));
    navigate("/login", { replace: true });
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toast = useToast();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      const response = await login({ email, password });

      dispatch(setTokens(response.tokens));
      dispatch(setUser(response.user));

      navigate(`/dashboard/${response.user.type.toString()}`, {
        replace: true,
      });
    } catch (err) {
      toast({
        title: `Error Logging in: ${err}`,
        status: "error",
      });
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
