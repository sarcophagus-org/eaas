import "dotenv/config";
import { BAD_ENV } from "./exit-codes";
import { exit } from "process";
import { logging } from "./logger";

const _tryReadEnv = (
  envName: string,
  envVar: string | undefined,
  config?: {
    required?: boolean;
    callback?: (envVar: string) => any;
  },
) => {
  const isRequired = config && config.required;
  if (isRequired && !envVar) {
    logging.error(`${envName} is required and not set in .env`);
    exit(BAD_ENV);
  } else if (!envVar) {
    return;
  }

  if (!config || !config.callback) return;

  try {
    config.callback(envVar);
  } catch (e) {
    logging.debug(e);
    logging.error(`${envName} is invalid: ${envVar}`);
    exit(BAD_ENV);
  }
};

export function validateEnvVars() {
  _tryReadEnv("PRIVATE_KEY", process.env.PRIVATE_KEY, { required: true });

  _tryReadEnv("PROVIDER_URL", process.env.PROVIDER_URL, { required: true });

  _tryReadEnv("ZERO_EX_API_KEY", process.env.ZERO_EX_API_KEY, {
    required: true,
  });
}
