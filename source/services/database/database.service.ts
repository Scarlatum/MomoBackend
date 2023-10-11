import { ROUTES } from "~/services/database/routes/routes.enum.ts"
import { BookRoute } from "~/services/database/routes/book/book.route.ts";
import { AuthorRoute } from "~/services/database/routes/author/author.route.ts"
import { SurrealModule } from "./modules/surreal.module.ts";
import { DatabaseModule } from "~/services/database/interfaces/module.interface.ts";
import { Container, ContainerType, Notation, getRequestContainerSchema } from "~/schemas/containers/request.schema.ts";
import { BookAPI } from "~/services/database/api/book.api.ts"
import { z } from "zod";

export type DatabaseRef = DatabaseModule;

export enum DBI { 
  TEST, 
  MAIN
};

export enum NSI { 
  DEVELOPMENT, 
  PRODUCTION,
};

export interface DatabaseParams {
  port: number
}

const ROUTES_LOOKUP_TABLE = {
  [ ROUTES.BOOK   ]: BookRoute,
  [ ROUTES.AUTHOR ]: AuthorRoute,
} as const;

type RoutesTable = typeof ROUTES_LOOKUP_TABLE;

namespace utils {
  export type OmitClientArg<T extends Array<any>> = T extends [ client: any, ...infer Rest ]
    ? Rest
    : never
}

namespace errors {
  export const enum router {
    ROUTING = 0b0000_0001,
    PANIC   = 0b1111_1111,
  }
}

export class DatabaseService {

  public db: DatabaseModule;

  constructor(params: DatabaseParams) {

    this.db = new SurrealModule({
      host      : "127.0.0.1",
      port      : params.port,
      database  : String(Deno.env.get("DATABASE_ID")),
      namespace : String(Deno.env.get("DATABASE_NAMESPACE")),
    });
    
    console.log(`info: ${ this.constructor.name } is running on ${ params.port } port`);

  }

  public route<
    const T extends keyof RoutesTable,
    const M extends keyof OnlyFunc<RoutesTable[T]>,
  > (
    route   : T, 
    method  : M,
    ...args : utils.OmitClientArg<ParametersUnsafe<RoutesTable[T][M]>>
  ) : Result<ReturnType<Callable<RoutesTable[T][M]>>> {

    const routedFunc = ROUTES_LOOKUP_TABLE[route][method];

    return typeof routedFunc === "function"
      ? routedFunc(this.db, ...args)
      : Error(`Router error: flag::${ errors.router.PANIC }`)

  }

  public async initialize(port: number) {

    await this.db.init();

    if ( Number.isNaN(port) ) throw Error();

    console.log(port);

    Deno.serve({ port }, async request => {

      if (request.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
      }
  
      const { socket, response } = Deno.upgradeWebSocket(request);

      socket.addEventListener("open", () => {
        console.log("a client connected!");
      });
  
      socket.addEventListener("message",  async event => {
        socket.send(await this.messageHandler(socket, event.data));
      });
  
      return response;

    });

    return this;
    
  }

  public async messageHandler(socket: WebSocket, message: string): Promise<string> {

    let container: Container;

    try { 

      container = getRequestContainerSchema().parse(JSON.parse(message))

    } catch(e) {

      return Promise.resolve(JSON.stringify({
        id        : crypto.randomUUID(),
        type      : ContainerType.ERROR,
        notation  : Notation.NEGATIVE,
        method    : "none",
        data      : e.message,
      } satisfies Container));

    }

    switch ( container.method ) {
      case "findBook":
        return BookAPI.findBook({ container, db: this });
      case "getAuthorOfBook":
        return BookAPI.getAuthorOfBook({ container, db: this });
      default:
        return Promise.resolve("undefined method");
    }

  }

  public async kill() {
    await this.db.kill();
  }

}