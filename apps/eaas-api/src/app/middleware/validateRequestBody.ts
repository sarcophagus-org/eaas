import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

export const validateRequestBody =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body);
    if (result.error) {
      const errMessages = result.error.details.map((x) => x.message);
      res.status(400).send({ error: errMessages.join(", ") });
    } else {
      req.body = result.value;
      next();
    }
  };
