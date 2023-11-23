export function formatToastMessage(message: string, length: number = 125): string {
  return message.length > length ? message.slice(0, length) + "..." : message;
}
