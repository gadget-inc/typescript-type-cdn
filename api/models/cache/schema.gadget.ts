import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "cache" model, go to https://typescript-type-cdn.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-DacGsO2Pn_Xe",
  fields: {
    packageVersion: {
      type: "string",
      validations: { required: true, unique: true },
      storageKey:
        "ModelField-xSrSIxsmuHeh::FieldStorageEpoch-sRTN1TU8YMmH",
    },
    serializedTypes: {
      type: "string",
      storageKey:
        "ModelField-ktBMRnmq2ekM::FieldStorageEpoch-EFgLBQkk5ckL",
    },
  },
};
