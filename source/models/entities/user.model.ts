
import { user } from "~/schemas/entities/user.schema.ts";

export class User implements user.struct {

  public id = String();
  public nickname = String();

  constructor() {
  }

}