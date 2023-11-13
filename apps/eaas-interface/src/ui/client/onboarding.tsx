import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useQuery } from "../../hooks/useQuery";
import { useState } from "react";
import { clientRegister } from "../../api/user";
import { setUser, setTokens } from "../../store/tempMemoryStore";
import { useNavigate } from "react-router-dom";

interface FormFieldValidation {
  password?: string;
  passwordConfirm?: string;
}

export const ClientOnboarding: React.FC = () => {
  const token = useQuery().get("token");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<FormFieldValidation>({});

  const navigate = useNavigate();

  const validatePassword = () => {
    if (!password) {
      setFormErrors((prevErrors) => ({ ...prevErrors, password: "Password is required" }));
    } else if (password.length < 8) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters",
      }));
    }
  };

  const handleRegister = async () => {
    // Reset form errors
    setFormErrors({});

    validatePassword();

    // If there are errors, stop registration process
    if (!!formErrors.password || !!formErrors.passwordConfirm) {
      return;
    }

    const response = await clientRegister({
      user: { password },
      inviteToken: token!,
    });

    if (response?.user) {
      // TOOO: extract response into global store
      setTokens(response.tokens);
      setUser(response.user);

      navigate("/dashboard/client", { replace: true });
    }
  };

  return (
    <Box>
      <Heading as="h1" size="xl">
        Client Onboarding
      </Heading>
      <Text>Set a password to register your account</Text>
      <FormControl id="password" isRequired isInvalid={!!formErrors.password}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={validatePassword}
        />
        <FormErrorMessage>{formErrors.password}</FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme="teal" onClick={handleRegister}>
        Register
      </Button>
    </Box>
  );
};
