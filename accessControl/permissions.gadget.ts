import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://typescript-type-cdn.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    Writers: {
      storageKey: "writers",
      default: {
        read: true,
        action: true,
      },
      models: {
        cache: {
          read: true,
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
      },
    },
    Readers: {
      storageKey: "readers",
      default: {
        read: true,
      },
      models: {
        cache: {
          read: true,
        },
      },
    },
    Unauthenticated: {
      storageKey: "unauthenticated",
    },
  },
};
