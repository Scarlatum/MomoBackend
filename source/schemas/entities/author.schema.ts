import { z } from "zod";
import getIdentitySchema from "~/schemas/common/identity.schema.ts";

export function getAuthorScheme() {
  return z.object({
    id        : z.string(),
    lastname  : z.string(),
    firstname : z.string(),
  }).merge(getIdentitySchema())
};

export namespace author {

  export type struct = z.infer<ReturnType<typeof getAuthorScheme>>;

}
