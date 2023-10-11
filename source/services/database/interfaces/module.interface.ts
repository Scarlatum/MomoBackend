type QueryResult = Array<{
  status: "OK" | "ERR",
  result: Array<any>
}>

export abstract class DatabaseModule {

  abstract init(): Promise<void>

  abstract query(query: string, bindings: Record<any,any>): Promise<QueryResult> 

  abstract kill(): Promise<void>

}