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

interface FormFieldValidation {
  name?: string;
  password?: string;
  phone?: string;
}

export const ClientOnboarding: React.FC = () => {
  const token = useQuery().get("token");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [formErrors, setFormErrors] = useState<FormFieldValidation>({});

  const validateName = () => {
    if (!name) {
      setFormErrors((prevErrors) => ({ ...prevErrors, name: "Name is required" }));
    }
  };

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

  const validatePhone = () => {
    if (!phone) {
      setFormErrors((prevErrors) => ({ ...prevErrors, phone: "Phone is required" }));
    }
  };

  const handleRegister = async () => {
    // Reset form errors
    setFormErrors({});

    // Validate form fields
    validateName();
    validatePassword();
    validatePhone();

    // If there are errors, stop registration process
    if (!!formErrors.name || !!formErrors.password || !!formErrors.phone) {
      return;
    }

    // Call register API method here
    console.log("Registering user with name:", name, "password:", password, "phone:", phone);
    clientRegister({
      user: {
        name,
        password,
        phone,
      },
      inviteToken: token!,
    });
  };

  return (
    <Box>
      <Heading as="h1" size="xl">
        Client Onboarding
      </Heading>
      <Text>Fill out the form to register your account</Text>

      <FormControl id="name" isRequired isInvalid={!!formErrors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={validateName}
        />
        <FormErrorMessage>Name is required</FormErrorMessage>
      </FormControl>

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

      <FormControl id="phone" isRequired isInvalid={!!formErrors.phone}>
        <FormLabel>Phone</FormLabel>
        <Input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={validatePhone}
        />
        <FormErrorMessage>Phone is required</FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme="teal" onClick={handleRegister}>
        Register
      </Button>
    </Box>
  );
};
