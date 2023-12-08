import { SarcophagusData } from "@sarcophagus-org/sarcophagus-v2-sdk-client";

export type SarcophagusDataWithClientEmail = SarcophagusData & { clientEmail?: string };
