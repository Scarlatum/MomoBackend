import { z } from "zod";
import getIdentitySchema from "~/schemas/common/identity.schema.ts";

export function getBookSchema() {
  return z.object({
    title     : z.string(),
    chapters  : z.number(),
    tags      : z.array(z.string())
  }).merge(getIdentitySchema())
}

export namespace book {

  export type struct = z.infer<ReturnType<typeof getBookSchema>>

}