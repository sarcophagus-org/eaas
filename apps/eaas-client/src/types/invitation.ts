enum InvitationStatus {
  pending,
  accepted,
}

export interface Invitation {
  clientEmail: string;
  status: InvitationStatus;
}
