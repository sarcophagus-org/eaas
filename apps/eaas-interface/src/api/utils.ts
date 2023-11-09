import { AxiosError } from "axios";

export function handleApiError(error: unknown) {
  let errorMessage = "An unknown error occurred";

  if (error instanceof AxiosError) {
    errorMessage = error.response?.data ?? error.message;
    console.log(errorMessage);
  } else {
    console.log(error);
  }

  return errorMessage;
}
