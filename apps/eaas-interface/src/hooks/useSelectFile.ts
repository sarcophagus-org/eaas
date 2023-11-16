import { useToast } from "@chakra-ui/react";
import prettyBytes from "pretty-bytes";
import { createRef, useState } from "react";

const maxFileSize = 400_000_000;

export function useSelectFile() {
  const [file, setFile] = useState<File>();
  const fileInputRef = createRef<HTMLInputElement>();
  const [error, setError] = useState<string | null>("");
  const toast = useToast();

  // Storing the file instead of the payload eliminates the need to save the payload in state
  function handleSetFile(newFile: File | undefined) {
    if (!newFile) return;
    if (newFile.size < maxFileSize) {
      toast({ title: "File selected", status: "success" });
      setError(null);
      setFile(newFile);
    } else {
      toast({ title: "File uploaded", status: "error" });
      setError(`File is too big! Your file size must not exceed ${prettyBytes(maxFileSize)}.`);
    }
  }

  return {
    error,
    file,
    fileInputRef,
    handleSetFile,
  };
}
