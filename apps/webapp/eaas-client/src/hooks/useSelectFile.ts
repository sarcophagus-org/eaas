import { useToast } from "@chakra-ui/react";
import prettyBytes from "pretty-bytes";
import { createRef, useState } from "react";
import { setFile } from "../store/embalm/actions";
import { useDispatch, useSelector } from "../store";
import { maxFileSize } from "utils/constants";
import { fileSelected, fileTooBig } from "utils/toast";

export function useSelectFile() {
  const dispatch = useDispatch();
  const file = useSelector((x) => x.embalmState.file);
  const fileInputRef = createRef<HTMLInputElement>();
  const [error, setError] = useState<string | null>("");
  const toast = useToast();

  function handleSetFile(newFile: File | undefined) {
    if (!newFile) return;
    if (newFile.size < maxFileSize) {
      toast(fileSelected());
      setError(null);
      dispatch(setFile(newFile));
    } else {
      toast(fileTooBig());
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
