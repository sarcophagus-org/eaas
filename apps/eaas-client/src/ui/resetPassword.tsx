import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useQuery } from "../hooks/useQuery";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordError, resetPasswordSuccess } from "utils/toast";
import { resetPassword } from "api/user";

interface FormFieldValidation {
  password?: string;
  passwordConfirm?: string;
}

export const ResetPassword: React.FC = () => {
  const token = useQuery().get("token");
  if (!token) {
    throw new Error("No token provided");
  }
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formErrors, setFormErrors] = useState<FormFieldValidation>({});

  const toast = useToast();
  const navigate = useNavigate();

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
    } else {
      setFormErrors({});
    }
  };

  const handleResetPassword = async () => {
    // Reset form errors
    setFormErrors({});

    validatePassword();

    // If there are errors, stop process
    if (!!formErrors.password || !!formErrors.passwordConfirm) {
      return;
    }

    try {
      await resetPassword({
        password,
        token: token!,
      });

      toast(resetPasswordSuccess());

      navigate("/login", { replace: true });
    } catch (err) {
      if (typeof err === "string") {
        toast(resetPasswordError(err));
      }
    }
  };

  return (
    <Box>
      <Heading as="h1" size="xl">
        Reset your password
      </Heading>
      <Box mt={10} />
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

      <Box mt={4} />

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

      <Button mt={4} colorScheme="teal" onClick={handleResetPassword}>
        Reset Password
      </Button>
    </Box>
  );
};
