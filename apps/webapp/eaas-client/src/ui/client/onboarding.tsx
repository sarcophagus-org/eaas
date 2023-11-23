import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useQuery } from "../../hooks/useQuery";
import { useState } from "react";
import { clientRegister } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "../../store";
import { setTokens, setUser } from "../../store/user/actions";
import { createAccountFailure } from "utils/toast";

interface FormFieldValidation {
  password?: string;
  passwordConfirm?: string;
}

export const ClientOnboarding: React.FC = () => {
  const token = useQuery().get("token");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formErrors, setFormErrors] = useState<FormFieldValidation>({});

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validatePassword = () => {
    if (!password) {
      setFormErrors((prevErrors) => ({ ...prevErrors, password: "Password is required" }));
    } else if (password.length < 8) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters",
      }));
    } else if (!passwordConfirm) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirm: "Password confirmation is required",
      }));
    } else if (passwordConfirm !== password) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirm: "Passwords do not match",
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

    try {
      const response = await clientRegister({
        user: { password },
        inviteToken: token!,
      });

      // TOOO: extract response into global store
      dispatch(setTokens(response.tokens));
      dispatch(setUser(response.user));

      navigate("/dashboard/client", { replace: true });
    } catch (err) {
      if (typeof err === "string") {
        toast(createAccountFailure(err));
      }
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

      <FormControl id="password_confirm" isRequired isInvalid={!!formErrors.passwordConfirm}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          onBlur={validatePassword}
        />
        <FormErrorMessage>{formErrors.passwordConfirm}</FormErrorMessage>
      </FormControl>

      <Button mt={4} colorScheme="teal" onClick={handleRegister}>
        Register
      </Button>
    </Box>
  );
};
