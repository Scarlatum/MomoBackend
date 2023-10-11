import { DATABASE_PORT, STORAGE_PORT, STORAGE_FOLDER_NAME } from "~/setup.ts"

import { SERVICES } from "~/services/services.enum.ts";
import { DatabaseService, DatabaseParams, DBI, NSI } from "~/services/database/database.service.ts";
import { StorageService, StorageParams } from "~/services/storage/storage.service.ts";

namespace types {

  type ServiceMap = {
    [ SERVICES.STORAGE   ]: typeof StorageService,
    [ SERVICES.DATABASE  ]: typeof DatabaseService
  };
  
  type ParamMap = {
    [ SERVICES.STORAGE   ]: StorageParams,
    [ SERVICES.DATABASE  ]: DatabaseParams,
  };
  
  export type InstanceMap = { [ K in keyof ServiceMap ]: InstanceType<ServiceMap[K]> };
  
  export type RegistartionMap<
    K extends keyof ParamMap = keyof ParamMap
  > = {
    [ I in K ]: {
      service : I,
      params  : ParamMap[I]
    }
  } [ K ];

}

class Application {

  public services: types.InstanceMap = Object();

  constructor(activeServices: Array<types.RegistartionMap>) {
    
    for ( const s of Object.values(activeServices) ) {
      switch (s.service) {
        case SERVICES.STORAGE: {
          this.services[s.service] = new StorageService(s.params)
        }; continue
        case SERVICES.DATABASE:
          this.services[s.service] = new DatabaseService(s.params);
      }
    }

  };

};

const app = new Application([
  { service: SERVICES.STORAGE, params: {
    port  : STORAGE_PORT,
    root  : Deno.realPathSync(`./${ STORAGE_FOLDER_NAME }`),
    cache : 0,
  } }, 
  { service: SERVICES.DATABASE, params: {
    port: DATABASE_PORT,
  } }
]);

app.services[SERVICES.DATABASE].initialize(DATABASE_PORT + 500);