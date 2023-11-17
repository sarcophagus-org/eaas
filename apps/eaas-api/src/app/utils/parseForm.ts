import multiparty from "multiparty";
import { preparedEncryptedPayloadSchema } from "../validationSchemas";
import { SendEncryptedPayloadParams } from "src/types/embalmPayload";

export async function parsePreparedEncryptedPayloadForm(req, res, next): Promise<any> {
  try {
    const form = new multiparty.Form();
    const sendEncryptedPayloadParams = await new Promise<SendEncryptedPayloadParams>(
      (resolve, reject) => {
        form.parse(req, (error, fields, _) => {
          if (error) {
            reject(error);
          } else {
            const preparedEncryptedPayloadJSON = preparedEncryptedPayloadSchema.validate(
              JSON.parse(fields.preparedEncryptedPayload),
            );

            if (preparedEncryptedPayloadJSON.error) {
              reject(preparedEncryptedPayloadJSON.error);
            } else {
              resolve({ ...fields, preparedEncryptedPayload: preparedEncryptedPayloadJSON.value });
            }
          }
        });
      },
    );

    req.body = sendEncryptedPayloadParams;
    next();
  } catch (error) {
    console.error("Error parsing prepared encrypted payload form:", error);
    res.status(400).json({ error });
  }
}
