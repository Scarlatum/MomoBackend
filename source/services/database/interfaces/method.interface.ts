import { DatabaseModule } from "~/services/database/interfaces/module.interface.ts"

export type Clientable<T extends object> = T & { client: DatabaseModule };