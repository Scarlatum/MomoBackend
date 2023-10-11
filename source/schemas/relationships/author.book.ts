import { z } from "zod";
import { getAuthorScheme } from "../entities/author.schema.ts";
import { getBookSchema } from "../entities/book.schema.ts";

export function getBookAuthorRelation() {
  return z.object({
    in  : getAuthorScheme(),
    out : getBookSchema(),
  })
}

export type BookAuthorRelation = z.infer<ReturnType<typeof getBookAuthorRelation>>;