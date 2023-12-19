import { Identifiable } from "./Identifiable";

export interface Invitation extends Identifiable {
  recipient_email: string;
  sender_id: string;
}

export interface InviteWithStatus {
  id?: string;
  clientEmail: string;
  status: string;
}
