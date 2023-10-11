import "https://deno.land/x/dotenv@v3.2.2/load.ts"
import { Timeout, TimeoutError } from "https://deno.land/x/timeout/mod.ts"
import { z } from "zod";

import { assert, assertEquals } from "assert";

import { DatabaseService } from "~/services/database/database.service.ts";
import { Book } from "~/models/entities/book.model.ts";
import { Container, ContainerType, getRequestContainerSchema } from "~/schemas/containers/request.schema.ts";
import { getBookSchema } from "~/schemas/entities/book.schema.ts";
import { getAuthorScheme } from "~/schemas/entities/author.schema.ts";
import { Author } from "~/models/entities/author.model.ts";
import { contracts } from "~/services/database/api/book.api.ts";

const CONNECTION_TIMEOUT = 1000;
const REQUEST_TIMEOUT = 1000;

Deno.test("Book API", { sanitizeResources: false, sanitizeOps: false }, async ctx => {

  const SOCKET_PORT = Number(Deno.env.get("DATABASE_WS_CLIENT_PORT") || 9000);
  const SOCKET_HOST = String(Deno.env.get("HOST"));

  const instance = new DatabaseService({
    port: 5000,
  });

  await instance.initialize(parseInt(Deno.env.get("DATABASE_WS_CLIENT_PORT")!) || 9000);

  const socketClient = new WebSocket(`ws://${ SOCKET_HOST }:${ SOCKET_PORT }`);

  await Timeout.wait(CONNECTION_TIMEOUT);

  if ( socketClient.readyState !== socketClient.OPEN ) throw Error("CONNETCTION TIMEOUT");

  await ctx.step("Get Book By ID", async () => {

    let result: Book = Object();
    
    const trnContainer: Container = {
      id: crypto.randomUUID(),
      type: ContainerType.REQUEST,
      method: "findBook",
      data: {
        id: "book:test",

      }
    };

    const handler = (event: MessageEvent) => {

      const recContainer = getRequestContainerSchema().parse(JSON.parse(event.data));

      if ( recContainer.id !== trnContainer.id ) return;

      const data = getBookSchema().parse(recContainer.data);

      result = new Book(data);

      socketClient.removeEventListener("message", handler);

    };

    socketClient.addEventListener("message", handler);
    socketClient.send(JSON.stringify(trnContainer));

    await Timeout.wait(REQUEST_TIMEOUT);

    assert(z.instanceof(Book).safeParse(result).success);

  });

  await ctx.step("Get Book's Authors", async () => {
    
    let result: Array<Author> = Object();

    const trnContainer: Container = {
      id: crypto.randomUUID(),
      type: ContainerType.REQUEST,
      method: "getAuthorOfBook",
      data: {
        id: "book:test"
      }
    };

    const handler = (event: MessageEvent) => {

      const recContainer = getRequestContainerSchema().parse(JSON.parse(event.data));

      if ( recContainer.id !== trnContainer.id ) return;

      const data = z.array(getAuthorScheme()).parse(JSON.parse(recContainer.data));

      result = data.map(x => new Author(x));

      socketClient.removeEventListener("message", handler);

    };

    socketClient.addEventListener("message", handler);
    socketClient.send(JSON.stringify(trnContainer));

    await Timeout.wait(REQUEST_TIMEOUT);

    assert(result.every(x => z.instanceof(Author).safeParse(x).success))

  })

})