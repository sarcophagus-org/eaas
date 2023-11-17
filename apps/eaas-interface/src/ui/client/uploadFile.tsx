import React from "react";
import { Tooltip, VStack, Text, Link, Container, Input } from "@chakra-ui/react";
import { useSelectFile } from "../../hooks/useSelectFile";
import { FileDragAndDrop } from "./fileDragAndDrop";
import prettyBytes from "pretty-bytes";

export const UploadFile = () => {
  const { error, file, fileInputRef, handleSetFile } = useSelectFile();

  async function handleFileDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer) return;
    const newFile = e.dataTransfer.files[0];
    handleSetFile(newFile);
  }

  const formattedFilename = !file ? "" : file.name;
  const filenameTooltip = formattedFilename;

  return (
    <VStack w="100%" align="left">
      <FileDragAndDrop
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        handleFileDrop={handleFileDrop}
      >
        {file ? (
          <VStack spacing={3}>
            {error && <Container mb={3}>{error}</Container>}
            <Tooltip label={filenameTooltip}>
              <Text px={2} maxW={600} align="center" flexWrap={"wrap"}>
                {formattedFilename}
              </Text>
            </Tooltip>
            <Text>Size: {prettyBytes(file.size)}</Text>

            <Link textDecor="underline">Upload a different file</Link>
          </VStack>
        ) : (
          <Text>
            Drag and drop or <Link textDecor="underline">browse files</Link>
          </Text>
        )}
      </FileDragAndDrop>

      <Input
        hidden
        onChange={(e) => {
          const newFile = e.target.files?.[0];
          handleSetFile(newFile);
        }}
        ref={fileInputRef}
        type="file"
      />
    </VStack>
  );
};
