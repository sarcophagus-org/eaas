import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React, { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const [isPasswordVisible, setIsPasswordVisibleEmail] = useState(false);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <InputGroup>
      <Input
        type={isPasswordVisible ? "text" : "password"}
        value={value}
        onChange={handlePasswordChange}
      />
      <InputRightElement onClick={() => setIsPasswordVisibleEmail(!isPasswordVisible)}>
        {isPasswordVisible ? <ViewOffIcon /> : <ViewIcon color="green.500" />}
      </InputRightElement>
    </InputGroup>
  );
};
