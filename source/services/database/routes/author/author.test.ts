import { assert } from "assert";

import { DBI, DatabaseService, NSI } from "~/services/database/database.service.ts";
import { ROUTES } from "~/services/database/routes/routes.enum.ts";
import { Author } from "../../../../models/entities/author.model.ts";

const instance = new DatabaseService({
  entry: {
    DS: DBI.TEST,
    NS: NSI.DEVELOPMENT,
  },
  port: 5000,
});

Deno.test({
  name: "getAuthor",
  async fn() {

    await instance.initialize(5000);

    const data = await instance.route(ROUTES.AUTHOR, "getAuthor", instance.client, {
      id: "test"
    });

    if ( data instanceof Error ) throw data;

    const [ x ] = data;

    assert(true);

    assert(JSON.stringify(x) === JSON.stringify(new Author({
      firstname: "firstname",
      lastname: "lastname",
      id: "author:test",
    })));

    await instance.kill();

  }
});