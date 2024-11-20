import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://typescript-type-cdn.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-19jKZsUinnLK",
  fields: {
    roles: {
      type: "roleList",
      default: ["Unauthenticated"],
      storageKey: "ModelField-w8yNr8ZptOSU::FieldStorageEpoch-6PzaZxHSIl2a",
    },
  },
};
