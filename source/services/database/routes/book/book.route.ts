import { ZodTypeAny, z } from "zod";
import { DatabaseRef } from "~/services/database/database.service.ts"
import { book, getBookSchema } from "~/schemas/entities/book.schema.ts";

import { QueryResult } from "~/services/database/utils/query.ts";
import { Book } from "~/models/entities/book.model.ts";
import { Author } from "~/models/entities/author.model.ts";
import { AuthorRoute } from "~/services/database/routes/author/author.route.ts";

const enum QUERIES {
  GET_AUTHOR_OF_BOOK  = /* surql */`SELECT VALUE <-authorRelation<-author FROM book WHERE id IS $id`,
  GET_BOOK_BY_ID      = /* surql */`SELECT * FROM book WHERE id IS $id`,
}

export class BookRoute {

  public static s : number = 0;

  private static parseQueryResult<
    T extends ZodTypeAny
  > (
    data    : QueryResult, 
    schema  : T
  ): Result<Array<Readonly<z.infer<T>>>> {

    const result: Array<Readonly<book.struct>> = [];

    for ( const x of data ) {
      switch (x.status) {
        case "OK": {

          try {
            for ( const book of x.result.map(n => schema.parse(n)) ) {
              result.push(book);
            }
          } catch(e) {
            return Error("invalid book schema", { cause: e });
          }

        } break;
        // !TODO: Сделать ошибку получше, и желательно вернуть её в подобающем виде.
        case "ERR": console.warn("query error")
          break;
      }
    }

    return result;

  }

  public static async getBook(client: DatabaseRef, params: Partial<book.struct>): Promise<Result<Array<Book>>> {

    try {
      z.object({
        id: z.string()
      }).parse(params);
    } catch(e) {
      return Error("", { cause: e });
    }

    const parseResult = BookRoute.parseQueryResult(await client.query(
      QUERIES.GET_BOOK_BY_ID + ";", 
      {
      id: params.id
    }), getBookSchema());

    if ( parseResult instanceof Error ) return parseResult;

    return parseResult.map(x => new Book(x));

  }

  public static async getAuthors(client: DatabaseRef, params: { book: Book }): Promise<Result<Array<Author>>> {

    const parseResult = BookRoute.parseQueryResult(await client.query(
      QUERIES.GET_AUTHOR_OF_BOOK + ";", 
      {
      id: params.book.id,
      }
    ), z.array(z.string()));

    if ( parseResult instanceof Error ) return parseResult;

    let result: Array<Author> = [];

    for await ( const ids of parseResult ) {
      for await ( const x of ids ) {

        const data = await AuthorRoute.getAuthor(client, {
          id: x,
        });

        if ( data instanceof Error ) continue;

        result = [ ...result, ...data ];

      }
    }

    return result;

  }

}