import { initialiseApp, startApp } from "./app";
import nodeFetch, {
  Headers,
  Request as nodeFetchRequest,
  Response as nodeFetchResponnse,
} from "node-fetch";

// @ts-ignore
globalThis.fetch = nodeFetch;
// @ts-ignore
globalThis.Headers = Headers;
// @ts-ignore
globalThis.Request = nodeFetchRequest;
// @ts-ignore
globalThis.Response = nodeFetchResponnse;

const app = initialiseApp();

startApp({ app });
