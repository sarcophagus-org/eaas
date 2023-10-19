import { ArchaeologistData, NodeSarcoClient } from "@sarcophagus-org/sarcophagus-v2-sdk";

export const dialArchaeologist = async (sarco: NodeSarcoClient, arch: ArchaeologistData) => {
  try {
    const connection = await sarco.archaeologist.dialArchaeologist(arch);
    return connection;
  } catch (e) {
    return undefined;
  }
};
