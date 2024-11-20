import { ActionOptions, applyParams, CreateCacheActionContext, save } from "gadget-server";

/**
 * @param { CreateCacheActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { CreateCacheActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: false },
};
