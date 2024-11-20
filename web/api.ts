import { Client } from "@gadget-client/typescript-type-cdn";

export const api = new Client({ environment: window.gadgetConfig.environment });
