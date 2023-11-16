import { AxiosError } from "axios";

export function handleApiError(error: unknown) {
  let errorMessage = "Unknown error";

  console.log(error);
  if (error instanceof AxiosError) {
    errorMessage = error.response?.data.error ?? error.response?.data ?? error.message;
  }

  return errorMessage;
}
