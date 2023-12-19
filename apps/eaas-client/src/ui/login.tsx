import React, { useState } from "react";
import { login } from "../api/user";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Link,
  Heading,
} from "@chakra-ui/react";
import { useDispatch } from "../store";
import { setTokens, setUser } from "../store/user/actions";
import { PasswordInput } from "./components/passwordInput";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toast = useToast();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
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
        <PasswordInput value={password} onChange={setPassword} />
      </FormControl>

      <Button colorScheme="blue" type="submit" onClick={handleSubmit}>
        Login
      </Button>

      <Link color="blue.500" onClick={() => navigate("/forgot-password")}>
        Forgot Password?
      </Link>

      <Heading mt={50} mb={5}>
        Looking to claim a Sarcophagus?
      </Heading>

      <Button
        colorScheme="blue"
        onClick={() => {
          navigate("/claim");
        }}
      >
        Claim a Sarcophagus
      </Button>
    </VStack>
  );
};
