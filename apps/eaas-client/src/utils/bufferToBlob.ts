export function bufferToBlob(buffer: Buffer) {
  const arrayBuffer = new Uint8Array(buffer).buffer;
  const blob = new Blob([arrayBuffer]);
  return blob;
}
