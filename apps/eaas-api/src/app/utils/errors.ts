export interface ApiError {
  msg: string;
  errorCode: number;
}

export interface ApiErrors {
  userNotFound: ApiError;
  emailAlreadyTaken: ApiError;
  userAlreadyExists: ApiError;
  userAlreadyInvited: ApiError;
  invalidUpdateFields: ApiError;
  incorrectPassword: ApiError;
  invalidToken: ApiError;
  invalidSignature: ApiError;
  tokenNotFound: ApiError;
  tokenExpired: ApiError;
  noUserFoundOnToken: ApiError;
  invalidUserOnToken: ApiError;
  unauthorized: ApiError;
  missingJWTSecret: ApiError;
  invalidInvitationToken: ApiError;
  noInvitationLinked: ApiError;
  invitationNotFound: ApiError;
  fetchSarcophagiFailure: ApiError;
  fetchSarcoClientEmailFailure: ApiError;
  rewrapSarcophagusFailure: ApiError;
  burySarcophagusFailure: ApiError;
  cleanSarcophagusFailure: ApiError;
  loadArchaeologistsFailure: ApiError;
  downloadRecipientPdfFailure: ApiError;
  noRecipientPdf: ApiError;
  incorrectPdfPassword: ApiError;
  editSarcophagusError: (e: string) => ApiError;
}

export const apiErrors: ApiErrors = {
  userNotFound: {
    msg: "user not found",
    errorCode: 404,
  },
  emailAlreadyTaken: {
    msg: "email already taken",
    errorCode: 400,
  },
  userAlreadyExists: {
    msg: "user already exists",
    errorCode: 400,
  },
  userAlreadyInvited: {
    msg: "user already invited",
    errorCode: 400,
  },
  invalidUpdateFields: {
    msg: "invalid update fields",
    errorCode: 400,
  },
  incorrectPassword: {
    msg: "incorrect password",
    errorCode: 400,
  },
  invalidToken: {
    msg: "invalid token",
    errorCode: 400,
  },
  invalidSignature: {
    msg: "invalid signature",
    errorCode: 400,
  },
  tokenNotFound: {
    msg: "token not found",
    errorCode: 404,
  },
  tokenExpired: {
    msg: "token expired",
    errorCode: 400,
  },
  noUserFoundOnToken: {
    msg: "no user found on token",
    errorCode: 400,
  },
  invalidUserOnToken: {
    msg: "invalid user on token",
    errorCode: 400,
  },
  noInvitationLinked: {
    msg: "there is no invitation linked to this inviteToken",
    errorCode: 400,
  },
  invalidInvitationToken: {
    msg: "invitation token is invalid",
    errorCode: 400,
  },
  unauthorized: {
    msg: "unauthorized",
    errorCode: 401,
  },
  missingJWTSecret: {
    msg: "Missing env var JWT_SECRET",
    errorCode: 500,
  },
  invitationNotFound: {
    msg: "invitation not found",
    errorCode: 404,
  },
  fetchSarcophagiFailure: {
    msg: "failed to fetch sarcophagi",
    errorCode: 500,
  },
  fetchSarcoClientEmailFailure: {
    msg: "failed to fetch sarcophagus client email",
    errorCode: 500,
  },
  rewrapSarcophagusFailure: {
    msg: "failed to rewrap sarcophagus",
    errorCode: 500,
  },
  burySarcophagusFailure: {
    msg: "failed to bury sarcophagus",
    errorCode: 500,
  },
  cleanSarcophagusFailure: {
    msg: "failed to clean sarcophagus",
    errorCode: 500,
  },
  loadArchaeologistsFailure: {
    msg: "failed to load archaeologists",
    errorCode: 500,
  },
  downloadRecipientPdfFailure: {
    msg: "failed to download recipient pdf",
    errorCode: 500,
  },
  noRecipientPdf: {
    msg: "no recipient pdf",
    errorCode: 404,
  },
  incorrectPdfPassword: {
    msg: "incorrect pdf password",
    errorCode: 400,
  },
  editSarcophagusError: (msg: string) => ({
    msg,
    errorCode: 400,
  }),
};
