import { SurrealWebSocket } from "surreal";
import { SERVICES } from "~/services/services.enum.ts";
import { DBI, NSI } from "~/services/database/database.service.ts";
import { DatabaseModule } from "~/services/database/interfaces/module.interface.ts";

interface SurrealConfig {
  host: string,
  port: number,
  database: string,
  namespace: string,
}

export class SurrealModule extends DatabaseModule {

  private _tag: SERVICES.DATABASE = SERVICES.DATABASE;

  public client: SurrealWebSocket = new SurrealWebSocket();

  constructor(private params: SurrealConfig) { super();

  }

  public override async init(): Promise<void> {
    
    await this.client.connect(`http://${ this.params.host }:${ this.params.port }`, {
      auth: {
        user: "default",
        pass: "default",
        DB: this.params.database,
        NS: this.params.namespace,
      }
    });

    console.log(`info: ${ this.constructor.name } is running on ${ this.params.port } port`);

  }

  public override async query(query: string, bindings: Record<any,any>): Promise<any> {
    return await this.client.query(query, bindings);
  }

  public override async kill(): Promise<void> {
    await this.client.close();
  }

}