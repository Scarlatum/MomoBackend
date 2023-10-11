import { ZodTypeAny, z } from "zod";
import { DatabaseRef } from "~/services/database/database.service.ts";
import { QueryResult } from "~/services/database/utils/query.ts";
import { author, getAuthorScheme } from "../../../../schemas/entities/author.schema.ts"
import { Author } from "../../../../models/entities/author.model.ts";

const enum QUERIES {
  GET_AUTHOR_BY_ID  = /* surql */`SELECT * FROM author WHERE id IS $id`,
}

export class AuthorRoute {

  private static parseQueryResult<T extends ZodTypeAny>(data: QueryResult, schema: T): Result<Array<z.infer<T>>> {

    const result: Array<author.struct> = [];

    for ( const x of data ) {
      switch ( x.status ) {
        case "OK": {

          try {
            for ( const book of x.result.map(n => schema.parse(n)) ) {
              result.push(book);
            }
          } catch(e) {
            console.log(e);
          } finally { break } 
          
        }
        case "ERR": console.warn("query error")
          break;
      }
    }

    return result;

  }

  public static async getAuthor(client: DatabaseRef, params: { id: string }): Promise<Result<Array<Author>>> {

    try {
      z.object({
        id: z.string()
      }).parse(params);
    } catch(e) {
      return Error("", { cause: e });
    }

    const parseResult = AuthorRoute.parseQueryResult(await client.query(
      QUERIES.GET_AUTHOR_BY_ID + ";", 
      {
      id: params.id
    }), getAuthorScheme());

    if ( parseResult instanceof Error ) return parseResult;

    return parseResult.map(x => new Author(x));

  } 

}