import { ZodObject, z } from "zod";
import getIdentitySchema from "~/schemas/common/identity.schema.ts";

export function getUserSchema() {
  return z.object({
    nickname: z.string()
  }).merge(getIdentitySchema())
}

export namespace user {

  export type struct = z.infer<ReturnType<typeof getUserSchema>>

}