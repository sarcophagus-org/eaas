import { useToast } from "@chakra-ui/react";
import prettyBytes from "pretty-bytes";
import { createRef, useState } from "react";
import { setSelectedFile } from "../store/tempMemoryStore";

const maxFileSize = 400_000_000;

export function useSelectFile() {
  const [file, setFile] = useState<File>();
  const fileInputRef = createRef<HTMLInputElement>();
  const [error, setError] = useState<string | null>("");
  const toast = useToast();

  function handleSetFile(newFile: File | undefined) {
    if (!newFile) return;
    if (newFile.size < maxFileSize) {
      toast({ title: "File selected", status: "success" });
      setError(null);
      setFile(newFile);
      setSelectedFile(newFile);
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
