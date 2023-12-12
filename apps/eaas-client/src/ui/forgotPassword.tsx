import React, { useState } from "react";
import { forgotPassword } from "../api/user";
import { FormControl, FormLabel, Input, Button, VStack, useToast } from "@chakra-ui/react";
import { forgotPasswordSuccess } from "utils/toast";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const toast = useToast();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      await forgotPassword(email);
      toast(forgotPasswordSuccess());
    } catch (err) {
      toast({
        title: `Error: ${err}`,
        status: "error",
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl id="email">
        <FormLabel>Enter the email address you use to login</FormLabel>
        <Input type="email" value={email} onChange={handleUsernameChange} />
      </FormControl>

      <Button colorScheme="blue" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </VStack>
  );
};
