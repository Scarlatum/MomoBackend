import { ZodAny, Schema, z } from "zod";
import { Container, ContainerType, Notation } from "~/schemas/containers/request.schema.ts";
import { ROUTES } from "~/services/database/routes/routes.enum.ts";
import { DatabaseService } from "~/services/database/database.service.ts";
import { getBookSchema } from '~/schemas/entities/book.schema.ts';
import getIdentitySchema from "~/schemas/common/identity.schema.ts";
import { Book } from "~/models/entities/book.model.ts";

export namespace contracts {
  
  export const findBook = getBookSchema()
    .partial()
    .merge(z.object({
      reliseDate: z.tuple([ z.date(), z.date() ])
        .optional()
        .default([ 
          new Date(0), 
          new Date(Date.now()) 
        ])
    }));

  export const getBooksAuthor = getIdentitySchema()

}

export interface EntryParameters {
  container : Container;
  db        : DatabaseService;
}

export class BookAPI {

  private static async parseSchema<
    T extends Schema
  > (
    schema: T, 
    container: Container
  ) : Promise<Result<z.infer<T>>> {

    const payload = await schema.safeParseAsync(container.data);

    if ( !payload.success ) return Error("container params is not valid" + JSON.stringify(container));

    return payload.data

  }

  static async findBook({ container, db }: EntryParameters) {

    const parseResult = await BookAPI
      .parseSchema(contracts.findBook, container);

    if ( parseResult instanceof Error ) return JSON.stringify({
      id        : container.id,
      type      : ContainerType.ERROR,
      notation  : Notation.NEGATIVE,
      method    : container.method,
      data      : parseResult.message
    } satisfies Container);

    const data = await db
      .route(ROUTES.BOOK, "getBook", parseResult);

    if ( data instanceof Error ) return Promise.resolve(data.message);

    if ( !data.length ) return Promise.resolve(JSON.stringify({
      id        : container.id,
      type      : ContainerType.RESPONSE,
      notation  : Notation.NEUTRAL,
      method    : container.method,
      data      : "book is not founded",
    } satisfies Container))

    return Promise.resolve(JSON.stringify({
      id        : container.id,
      type      : ContainerType.RESPONSE,
      notation  : Notation.POSITIVE,
      method    : container.method,
      data      : data[0],
    } satisfies Container))

  }

  static async getAuthorOfBook({ container, db }: EntryParameters) {
    
    const parseResult = await BookAPI
      .parseSchema(contracts.getBooksAuthor, container);

    if ( parseResult instanceof Error ) return JSON.stringify({
      id        : container.id,
      type      : ContainerType.ERROR,
      notation  : Notation.NEGATIVE,
      method    : container.method,
      data      : parseResult.message
    } satisfies Container);

    const data = await db
      .route(ROUTES.BOOK, "getAuthors", {
        book: new Book({ ...Book.default, id: parseResult.id })
      });

    if ( data instanceof Error ) return Promise.resolve(data.message);

    if ( !data.length ) return Promise.resolve(JSON.stringify({
      id        : container.id,
      type      : ContainerType.RESPONSE,
      notation  : Notation.NEUTRAL,
      method    : container.method,
      data      : "book is not founded",
    } satisfies Container))

    return Promise.resolve(JSON.stringify({
      id        : container.id,
      type      : ContainerType.RESPONSE,
      notation  : Notation.POSITIVE,
      method    : container.method,
      data      : JSON.stringify(data),
    } satisfies Container))

  }

}