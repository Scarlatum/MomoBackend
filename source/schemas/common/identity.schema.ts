import { z } from "zod";

export default function getIdentitySchema() {
  return z.object({
    id: z.string()
  })
}