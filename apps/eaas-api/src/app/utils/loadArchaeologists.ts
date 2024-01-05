import jsonfile from "jsonfile";
import { apiErrors } from "./errors";


interface ArchaeologistsConfig {
  addresses: string[];
  requiredArchaeologists: number;
}

export async function loadArchaeologistAddressesFromFile(): Promise<ArchaeologistsConfig> {
  const archsFile = "./archaeologists.json";

  try {
    return (await jsonfile.readFile(archsFile)) as ArchaeologistsConfig;
  } catch (e) {
    console.log("Error loading archaeologists from file", e);
    throw apiErrors.loadArchaeologistsFailure;
  }
}
