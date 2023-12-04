// Sarcophagus toast messages
// All toast message parameters are defined in this file

import { UseToastOptions } from "@chakra-ui/react";
import prettyBytes from "pretty-bytes";
import { maxFileSize } from "./constants";

export function formatToastMessage(message: string, length: number = 125): string {
  return message.length > length ? message.slice(0, length) + "..." : message;
}

const defaultOptions: Partial<UseToastOptions> = {
  duration: 5000,
  isClosable: true,
  position: "bottom-right",
};

export const fileTooBig = (): UseToastOptions => ({
  title: "File too big",
  description: `Your file size must not exceed ${prettyBytes(maxFileSize)}.`,
  status: "error",
  ...defaultOptions,
});

export const fileSelected = (): UseToastOptions => ({
  title: "File selected",
  description: "Your file has been selected.",
  status: "success",
  ...defaultOptions,
});

export const generatedOuterKeys = (id: string): UseToastOptions => ({
  title: "Keys generated",
  description: "A new pair of encryption keys have been generated.",
  status: "success",
  id,
  ...defaultOptions,
});

export const generateOuterKeysFailure = (errorMessage: string): UseToastOptions => ({
  title: "Failed to generate keys",
  description: formatToastMessage(errorMessage),
  status: "error",
  ...defaultOptions,
});

export const generatePDFFailure = (errorMessage: string): UseToastOptions => ({
  title: "Failed to generate recipient PDF",
  description: formatToastMessage(errorMessage),
  status: "error",
  ...defaultOptions,
});

export const cleanSuccess = (): UseToastOptions => ({
  title: "Clean Successful.",
  description: "Your sarcophagus was cleaned successfully",
  status: "success",
  ...defaultOptions,
});

export const cleanFailure = (e: string): UseToastOptions => ({
  title: "Clean Failed.",
  description: `The sarcophagus was not cleaned: ${e}`,
  status: "error",
  ...defaultOptions,
});

export const approveSuccess = (): UseToastOptions => ({
  title: "Approve Successful.",
  status: "success",
  ...defaultOptions,
});

export const approveFailure = (): UseToastOptions => ({
  title: "Approve Failed.",
  status: "error",
  ...defaultOptions,
});

export const fileUploadSuccess = (): UseToastOptions => ({
  title: "Your file has been uploaded!",
  description: "Please wait while the transaction is confirmed.",
  status: "success",
  ...defaultOptions,
});

export const fileUploadFailure = (e: string): UseToastOptions => ({
  title: "Error while uploading",
  description: e,
  status: "error",
  ...defaultOptions,
});

export const createAccountFailure = (e: string): UseToastOptions => ({
  title: `Error creating account: ${e}`,
  status: "error",
  ...defaultOptions,
});

export const clientInvited = (): UseToastOptions => ({
  title: "Client invited!",
  status: "success",
  ...defaultOptions,
});
export const clientInviteFailed = (e: string): UseToastOptions => ({
  title: `Error inviting client: ${e}`,
  status: "error",
  ...defaultOptions,
});

export const getClientSarcophagiFailed = (e: string): UseToastOptions => ({
  title: `Error fetching Sarcophagi: ${e}`,
  status: "error",
  ...defaultOptions,
});

export const rewrapSuccess = (): UseToastOptions => ({
  title: "Successfully rewrapped!",
  status: "success",
  ...defaultOptions,
});
export const rewrapFailed = (e: string): UseToastOptions => ({
  title: `Error rewrapping the Sarcophagus: ${e}`,
  status: "error",
  ...defaultOptions,
});

export const burySuccess = (): UseToastOptions => ({
  title: "Successfully buried!",
  status: "success",
});
export const buryFailed = (e: string): UseToastOptions => ({
  title: `Error burying the Sarcophagus: ${e}`,
  status: "error",
});

export const forgotPasswordSuccess = (): UseToastOptions => ({
  title: "Success!",
  description: "Please check your email for a link to reset your password.",
  status: "success",
  ...defaultOptions,
});

export const resetPasswordSuccess = (): UseToastOptions => ({
  title: "Success!",
  description: "Please login with your new password.",
  status: "success",
  ...defaultOptions,
});

export const resetPasswordError = (e: string): UseToastOptions => ({
  title: "Failed to reset password",
  description: e,
  status: "error",
  ...defaultOptions,
});
