import { DatabaseRef } from "~/services/database/database.service.ts";

export type QueryResult = UnwrapPromise<ReturnType<DatabaseRef["query"]>>;
